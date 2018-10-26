// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import forEach from 'lodash/forEach';
import memoizeOne from 'memoize-one';
import { getPromise } from '../reducers/selectors';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import buildActionsFromMappings, {
  ensureResourceIsObject,
  validateResourceObject,
} from '../utils/buildActionsFromMappings';
import type { ReactReduxFetchResource, PromiseState, ResourceName } from '../types';

type DispatchFunctions = Object;
type Config = Array<ReactReduxFetchResource>;

type PropsFromParent = {
  config: Config,
  children: Object => React.Node,
  fetchOnMount?: boolean | Array<ResourceName>,
  onFulfil?: (ResourceName, PromiseState<*>, DispatchFunctions) => void,
  onReject?: (ResourceName, PromiseState<*>, DispatchFunctions) => void,
};

type ReduxProps = {
  dispatch: Function,
  fetchData: Object,
};

type Props = PropsFromParent & ReduxProps;

type State = {
  dispatchFunctions: DispatchFunctions,
};

const getResourceNames = memoizeOne((config: Config) =>
  map(config, (mapping: ReactReduxFetchResource) => {
    const resource = ensureResourceIsObject(mapping);
    validateResourceObject(resource);
    return `${resource.name}`;
  }),
);

class ReduxFetch extends React.Component<Props, State> {
  /**
   * @param {Function} dispatch Redux dispatch function
   * @param {Array} mappings Array of objects with shape:
   *                {resource: ..., method: ..., request: ...}
   * @return {Object} functions for the WrappedComponent e.g.: 'dispatchUserFetch()'
   * */
  static actionsFromProps = (dispatch: Function, mappings: Config): Object =>
    reduce(
      buildActionsFromMappings(mappings),
      (actions, actionCreator, key) =>
        Object.assign({}, actions, {
          [ReduxFetch.getDispatchFunctionName(key)]: (...args) => {
            const action = actionCreator(...args);
            if (action) {
              dispatch(action);
            }
          },
        }),
      {},
    );

  static getDispatchFunctionName = (resourceName: ResourceName) =>
    `dispatch${capitalizeFirstLetter(resourceName)}`;

  constructor(props: Props) {
    super(props);

    if (typeof props.config === 'function') {
      throw new Error(
        "react-redux-fetch with render props doesn't support config as a function. Use an array instead.",
      );
    }

    this.state = {
      dispatchFunctions: ReduxFetch.actionsFromProps(props.dispatch, props.config),
    };
  }

  componentDidMount() {
    const { fetchOnMount } = this.props;
    const { dispatchFunctions } = this.state;

    if (!fetchOnMount) {
      return;
    }

    if (typeof fetchOnMount === 'boolean') {
      forEach(dispatchFunctions, dispatchFn => dispatchFn());
      return;
    }

    if (Array.isArray(fetchOnMount)) {
      fetchOnMount.forEach((resourceName: ResourceName) =>
        forEach(dispatchFunctions, (dispatchFn, fnName) => {
          if (fnName.toLowerCase().includes(resourceName.toLowerCase())) {
            dispatchFn();
          }
        }),
      );
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.children !== nextProps.children ||
      !isEqual(this.props.fetchData, nextProps.fetchData)
    );
  }

  componentDidUpdate(prevProps: Props) {
    const onFulfil = this.props.onFulfil;
    const onReject = this.props.onReject;

    if (onFulfil || onReject) {
      map(this.props.fetchData, (repository: PromiseState<*>, key: string) => {
        if (prevProps.fetchData[key].pending) {
          if (onFulfil && repository.fulfilled) {
            onFulfil(key, repository, this.state.dispatchFunctions);
          }
          if (onReject && repository.rejected) {
            onReject(key, repository, this.state.dispatchFunctions);
          }
        }
      });
    }
  }

  render() {
    const { children, fetchData } = this.props;
    const { dispatchFunctions } = this.state;

    return children({ ...fetchData, ...dispatchFunctions });
  }
}

// TODO: this can probably be memoized with a custom moization function,
// this should make 'shouldComponentUpdate' obsolete
const getFetchData = (state, config: Config) =>
  reduce(
    getResourceNames(config),
    (data, resourceName) => {
      // eslint-disable-next-line no-param-reassign
      data[`${resourceName}Fetch`] = getPromise(resourceName).fromState(state) || {};
      return data;
    },
    {},
  );

const mapStateToProps = (state, props: PropsFromParent) => ({
  fetchData: getFetchData(state, props.config),
});

export default connect(mapStateToProps)(ReduxFetch);
