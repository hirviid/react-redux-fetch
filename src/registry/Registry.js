import defaultHeaders from '../utils/defaultHeaders';

class Registry {

    defaults = {
        headers: defaultHeaders
    };

    _headers = defaultHeaders;
    _requestTypes = {};
    _reducers = {};

    getHeaders() {
        return this._headers;
    }
    setHeaders(headers) {
        this._headers = headers;
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
     * @param {string} type - a HTTP verb (e.g. 'post')
     * @param {Object} config
     *  - {string} actionPrefix - a more human readable verb, to append to the action passed to the component. e.g.: 'create'
     *  - {Function} middleware - the redux middleware to handle the request
     *  - {Function} reducer - the redux reducer to handle the actions
     * @return {Registry} The current Registry instance
     */
    registerRequestMethod(type, config) {
        this._requestTypes[type] = Object.assign({type}, config);
        return this;
    }

    getRequestMethodConfig(type) {
        return this._requestTypes[type];
    }

    /**
     * @return {Array} Array of request method configurations
     */
    getAllRequestMethodConfigs() {
        return this._requestTypes;
    }
}

export default Registry;
