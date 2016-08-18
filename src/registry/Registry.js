import defaultHeaders from '../utils/defaultHeaders';
import defaultRequestBuilder from '../utils/requestBuilder';
import assert from '../utils/assert';

class Registry {

    defaults = {
        headers: defaultHeaders
    };

    _headers = defaultHeaders;
    _requestMethodConfigs = {};
    _reducers = {};
    _requestBuilder = defaultRequestBuilder;

    getHeaders() {
        return this._headers;
    }
    setHeaders(headers) {
        this._headers = headers;
    }

    /**
     * Register a request builder
     * @param {Function} requestBuilder - A function which should return anything fetch api can handle
     * @return {Registry} The current registry instance
     */
    registerRequestBuilder(requestBuilder) {
        this._requestBuilder = requestBuilder;
        return this;
    }
    getRequestBuilder() {
        return this._requestBuilder;
    }

    /**
     * Add custom reducers, in order to access the reqres state slice
     * @param {string} key - The slice in reqres state that the reducer should handle
     * @param {Function} reducer - A redux reducer function
     * @return {Registry} The current Registry instance
     */
    registerReducer(key, reducer) {
        this._reducers[key] = reducer;
        return this;
    }
    getReducers() {
        return this._reducers;
    }

    /**
     * @param {string} method - a HTTP verb (e.g. 'post')
     * @param {Object} config
     *  - {string} actionPrefix - a more human readable verb, to append to the action passed to the component. e.g.: 'create'
     *  - {Function} middleware - the redux middleware to handle the request
     *  - {Function} reducer - the redux reducer to handle the actions
     * @return {Registry} The current Registry instance
     */
    registerRequestMethod(method, config) {
        assert.exists(method, '"method" is required');
        assert.contains(config, 'actionPrefix');
        assert.contains(config, 'middleware');
        assert.contains(config, 'reducer');
        this._requestMethodConfigs[method] = Object.assign({method}, config);
        return this;
    }

    getRequestMethodConfig(type) {
        return this._requestMethodConfigs[type];
    }

    /**
     * @return {Object} Array of request method configurations
     */
    getAllRequestMethodConfigs() {
        return this._requestMethodConfigs;
    }
}

export default Registry;
