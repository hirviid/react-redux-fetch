// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { getPromise } from '../reducers/selectors';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import buildActionsFromMappings, {
  ensureResourceIsObject,
  validateResourceObject,
} from '../utils/buildActionsFromMappings';
import type { ReactReduxFetchResource } from '../types';

type Config = Array<ReactReduxFetchResource>;
type Props = {
  config: Config,
  dispatch: Function,
  children: Object => React.Node,
  fetchData: Object,
};
type State = {
  dispatchFunctions: Object,
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
          [`dispatch${capitalizeFirstLetter(key)}`]: (...args) => {
            const action = actionCreator(...args);
            if (action) {
              dispatch(action);
            }
          },
        }),
      {},
    );

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

  shouldComponentUpdate(nextProps) {
    return (
      this.props.children !== nextProps.children ||
      !isEqual(this.props.fetchData, nextProps.fetchData)
    );
  }

  render() {
    const { children, fetchData } = this.props;
    const { dispatchFunctions } = this.state;

    return children({ ...fetchData, ...dispatchFunctions });
  }
}

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

const mapStateToProps = (state, props: Props) => ({
  fetchData: getFetchData(state, props.config),
});

export default connect(mapStateToProps)(ReduxFetch);
