// @flow

import React, { Component } from 'react';
import type { ComponentType } from 'react';
import { connect as reduxConnect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
// import reactReduxFetchActions from '../actions';
import { getModel } from '../reducers/selectors';
// import container from '../container';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import buildActionsFromMappings, {
  ensureResourceIsObject,
  validateResourceObject,
} from '../utils/buildActionsFromMappings';
import helpers from '../utils/helpers';
import type { reduxAction } from '../types';

// const defaultRequestType = 'get';

type Props = {
  dispatch: Dispatch<reduxAction>,
  fetchData: Object,
};

type State = {
  dispatchFunctions?: Object,
}

type FuncOrArr = Function | Array<*>;
type OptionalFuncOrObj = Function | Object | null;

function getDisplayName(WrappedComponent: ComponentType<*>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function connect(
  mapPropsToRequestsToProps: FuncOrArr,
  componentMapStateToProps?: OptionalFuncOrObj = null,
  componentMapDispatchToProps?: OptionalFuncOrObj = null,
) {
  return function wrapWithReactReduxFetch(WrappedComponent: ComponentType<*>) {
    class ReactReduxFetch extends Component<Props, State> {
      constructor(props) {
        super(props);

        // if mapPropsToRequestsToProps is a function,
        // we can't cache our dispatch functions because they might depend on the props.
        // We could support this in the future by building the functions again when te props change.
        if (typeof mapPropsToRequestsToProps === 'function') {
          return;
        }

        this.state = {
          dispatchFunctions: this.actionsFromProps(props.dispatch, mapPropsToRequestsToProps),
        };
      }

      state = {};

      /**
       * @param {Object} fetchData The complete react-redux-fetch state leaf
       * @param {Array} mappings Array of objects with shape:
       *                {resource: ..., method: ..., request: ...}
       * @return {Object} all the resources the WrappedComponent requested
       */
      getFilteredFetchData = (fetchData, mappings) => {
        const data = {};

        each(mappings, (mapping) => {
          const resource = ensureResourceIsObject(mapping);
          validateResourceObject(resource);
          const resourceName = resource.name;

          data[`${resourceName}Fetch`] = fetchData[resourceName] || {};
        });

        return data;
      };

      /**
       * @param {Function} dispatch Redux dispatch function
       * @param {Array} mappings Array of objects with shape:
       *                {resource: ..., method: ..., request: ...}
       * @return {Object} functions for the WrappedComponent e.g.: 'dispatchUserFetch()'
       * */
      actionsFromProps = (dispatch, mappings: Array<*>): Object =>
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
       * If the value passed to connect() is a function,
       *    execute the function and pass the props + context
       * @param {Object} props React props
       * @param {Object} context React context
       * @return {Array} an array with request configurations
       * */
      buildMappings = (props: Props, context: Object): Array<*> => {
        const finalProps = props || this.props;
        const finalContext = context || this.context || {};

        return isFunction(mapPropsToRequestsToProps)
          ? // $FlowFixMe
          mapPropsToRequestsToProps(finalProps, finalContext)
          : // $FlowFixMe
          mapPropsToRequestsToProps;
      };

      render() {
        const { fetchData, ...other } = this.props;
        const { dispatchFunctions } = this.state;

        const mappings = this.buildMappings(this.props, this.context);
        const actions = dispatchFunctions || this.actionsFromProps(this.props.dispatch, mappings);
        const data = this.getFilteredFetchData(fetchData, mappings);

        return <WrappedComponent {...other} {...actions} {...data} />;
      }
    }

    ReactReduxFetch.displayName = `ReactReduxFetch.connect(${getDisplayName(WrappedComponent)})`;

    // ReactReduxFetch.propTypes = {
    //   dispatch: PropTypes.func.isRequired,
    //   fetchData: PropTypes.object.isRequired,
    // };

    const mapStateToProps = (state, props) =>
      merge(
        { fetchData: getModel(state) },
        helpers.ensureObject(componentMapStateToProps, [state, props]),
      );

    let mapDispatchToProps;

    if (isFunction(componentMapDispatchToProps)) {
      mapDispatchToProps = (dispatch: Dispatch<reduxAction>) =>
        // $FlowFixMe: suppressing until assert issue is resolved (https://github.com/facebook/flow/issues/34)
        merge({ dispatch }, componentMapDispatchToProps(dispatch));
    } else if (isObject(componentMapDispatchToProps)) {
      mapDispatchToProps = (dispatch: Dispatch<reduxAction>) =>
        // $FlowFixMe: suppressing until assert issue is resolved (https://github.com/facebook/flow/issues/34)
        merge({ dispatch }, bindActionCreators(componentMapDispatchToProps, dispatch));
    }

    return reduxConnect(mapStateToProps, mapDispatchToProps)(ReactReduxFetch);
  };
}

// function factory(defaults = {}, options = {}) {
function factory() {
  function connectImpl(
    map: FuncOrArr,
    mapStateToProps?: OptionalFuncOrObj,
    mapDispatchToProps?: OptionalFuncOrObj,
  ) {
    return connect(map, mapStateToProps, mapDispatchToProps);
  }

  return connectImpl;
}

export default factory();
