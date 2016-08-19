import React, { Component, PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import each from 'lodash/each';
import noop from 'lodash/noop';
import reactReduxFetchActions from '../actions';
import {getFetchData} from '../reducers/selectors';
import container from '../container';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';

const defaultRequestType = 'get';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function requestMethodToActionKey(key, requestMethod = defaultRequestType) {
    requestMethod = requestMethod.toLowerCase();
    key = capitalizeFirstLetter(key);

    const requestMethodConfig = container.getDefinition('requestMethods').getArgument(requestMethod);

    if (!requestMethodConfig) {
        throw new Error(`Request method ${requestMethod} not registered at react-redux-fetch. Use container.getDefinition('requestMethods').addArgument().`);
    }

    return 'dispatch' + key + capitalizeFirstLetter(requestMethodConfig.method);
}

function factory(/*defaults = {}, options = {}*/) {

    function connectImpl(map, mapStateToProps) {
        return connect(map, mapStateToProps);
    }

    return connectImpl;
}

export default factory({
    //TODO add defaults
});

function connect(mapPropsToRequestsToProps, comMapStateToProps = noop) {

    return function wrapWithReactReduxFetch(WrappedComponent) {

        class ReactReduxFetch extends Component {

            static propTypes = {
                dispatch: PropTypes.func.isRequired,
                fetchData: PropTypes.object
            };

            /**
             * If the value passed to connect() is a function, execute the function and pass the props + context
             * @param {Object} props React props
             * @param {Object} context React context
             * @return {Array} an array with request configurations
             **/
            buildMappings = (props = this.props, context = this.context) => {
                return isFunction(mapPropsToRequestsToProps) ? mapPropsToRequestsToProps(props, context || {}) : mapPropsToRequestsToProps;
            };

            /**
             * @param {Function} dispatch Redux dispatch function
             * @param {Array} mappings Array of objects with shape: {resource: ..., method: ..., request: ...}
             * @return {Object} functions for the WrappedComponent e.g.: 'dispatchUserFetch()'
             **/
            actionsFromProps = (dispatch, mappings) => {
                let actions = {};

                each(mappings, (mapping) => {

                    const finalConfigFn = mapping.request;
                    const finalKey = mapping.resource;

                    if (!finalKey) {
                        throw new Error(`'resource' property missing in mapping for '${getDisplayName(WrappedComponent)}'.`);
                    }

                    const requestMethod = mapping.method || defaultRequestType;

                    actions[requestMethodToActionKey(finalKey, requestMethod)] = (...args) => {
                        const finalConfig = isFunction(finalConfigFn) ? finalConfigFn(...args) : finalConfigFn;
                        const reduxAction = reactReduxFetchActions.for(requestMethod).request(finalKey, finalConfig.url, finalConfig);

                        dispatch(reduxAction);
                        return reduxAction;
                    };

                });

                return actions;
            };

            /**
             * @param {Object} fetchData The complete react-redux-fetch state leaf
             * @param {Array} mappings Array of objects with shape: {resource: ..., method: ..., request: ...}
             * @return {Object} all the resources the WrappedComponent requested
             */
            getFilteredFetchData = (fetchData, mappings) => {
                let data = {};

                each(mappings, (mapping) => {
                    const finalKey = mapping.resource;

                    data[finalKey + 'Fetch'] = fetchData[finalKey] || {};
                });

                return data;
            };

            render() {
                const {fetchData, ...other} = this.props;

                const mappings = this.buildMappings(this.props, this.context);
                const actions = this.actionsFromProps(this.props.dispatch, mappings);
                const data = this.getFilteredFetchData(fetchData, mappings);

                return <WrappedComponent {...other} {...actions} {...data} />;
            }
        }

        ReactReduxFetch.displayName = `ReactReduxFetch.connect(${getDisplayName(WrappedComponent)})`;

        const mapStateToProps = (state) => (merge({
                fetchData: getFetchData(state)
            }, comMapStateToProps(state))
        );

        return reduxConnect(mapStateToProps)(ReactReduxFetch);
    };

}
