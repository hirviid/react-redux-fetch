// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { getModel } from '../reducers/selectors';
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

class ReduxFetch extends React.PureComponent<Props, State> {
  /**
   * @param {Function} dispatch Redux dispatch function
   * @param {Array} mappings Array of objects with shape:
   *                {resource: ..., method: ..., request: ...}
   * @return {Object} functions for the WrappedComponent e.g.: 'dispatchUserFetch()'
   * */
  static actionsFromProps = (dispatch, mappings: Config): Object =>
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

  /**
   * @param {Object} fetchData The complete react-redux-fetch state leaf
   * @param {Array} config Array of objects with shape:
   *                {resource: ..., method: ..., request: ...}
   * @return {Object} all the resources the WrappedComponent requested
   */
  static getFilteredFetchData = (fetchData, config: Config) => {
    const resourceNames = getResourceNames(config);
    return reduce(
      resourceNames,
      (data, resourceName) => {
        // eslint-disable-next-line no-param-reassign
        data[`${resourceName}Fetch`] = fetchData[resourceName] || {};
        return data;
      },
      {},
    );
  };

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
    if (this.props.children !== nextProps.children) {
      return true;
    }

    const prevData = ReduxFetch.getFilteredFetchData(this.props.fetchData, this.props.config);
    const nextData = ReduxFetch.getFilteredFetchData(nextProps.fetchData, nextProps.config);
    return !isEqual(prevData, nextData);
  }

  render() {
    const { children, fetchData, config } = this.props;
    const { dispatchFunctions } = this.state;

    const data = ReduxFetch.getFilteredFetchData(fetchData, config);

    return children({ ...data, ...dispatchFunctions });
  }
}

const mapStateToProps = state => ({
  fetchData: getModel(state),
});

export default connect(mapStateToProps)(ReduxFetch);
