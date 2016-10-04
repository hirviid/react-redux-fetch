import React, { Component } from 'react';
import { connect as reduxConnect } from 'react-redux';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import each from 'lodash/each';
import reduce from 'lodash/reduce';
// import reactReduxFetchActions from '../actions';
import { getModel } from '../reducers/selectors';
// import container from '../container';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import buildActionsFromMappings,
{ ensureResourceIsObject, validateResourceObject } from '../utils/buildActionsFromMappings';

// const defaultRequestType = 'get';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function connect(mapPropsToRequestsToProps,
                 componentMapStateToProps = null,
                 componentMapDispatchToProps = null) {
  return function wrapWithReactReduxFetch(WrappedComponent) {
    class ReactReduxFetch extends Component {

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
       **/
      actionsFromProps = (dispatch, mappings) =>
        reduce(buildActionsFromMappings(mappings), (actions, actionCreator, key) =>
          Object.assign(
            {},
            actions,
            { [`dispatch${capitalizeFirstLetter(key)}`]: (...args) => {
              const action = actionCreator(...args);
              if (action) {
                dispatch(action);
              }
            } }
          ), {});

      /**
       * If the value passed to connect() is a function,
       *    execute the function and pass the props + context
       * @param {Object} props React props
       * @param {Object} context React context
       * @return {Array} an array with request configurations
       **/
      buildMappings = (props = this.props, context = this.context) => (
        isFunction(mapPropsToRequestsToProps) ?
          mapPropsToRequestsToProps(props, context || {})
          : mapPropsToRequestsToProps
      );

      render() {
        const { fetchData, ...other } = this.props;

        const mappings = this.buildMappings(this.props, this.context);
        const actions = this.actionsFromProps(this.props.dispatch, mappings);
        const data = this.getFilteredFetchData(fetchData, mappings);

        return <WrappedComponent {...other} {...actions} {...data} />;
      }
    }

    ReactReduxFetch.displayName = `ReactReduxFetch.connect(${getDisplayName(WrappedComponent)})`;

    ReactReduxFetch.propTypes = {
      dispatch: React.PropTypes.func.isRequired,
      fetchData: React.PropTypes.object,
    };

    const mapStateToProps = state => (merge({
      fetchData: getModel(state),
    }, isFunction(componentMapStateToProps) ? componentMapStateToProps(state) : {}));

    const mapDispatchToProps = dispatch => (merge({
      dispatch,
    }, isFunction(componentMapDispatchToProps) ? componentMapDispatchToProps(dispatch) : {}));

    return reduxConnect(mapStateToProps, mapDispatchToProps)(ReactReduxFetch);
  };
}

// function factory(defaults = {}, options = {}) {
function factory() {
  function connectImpl(map, mapStateToProps, mapDispatchToProps) {
    return connect(map, mapStateToProps, mapDispatchToProps);
  }

  return connectImpl;
}

export default factory({
  // TODO add defaults
});
