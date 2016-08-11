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
     * @return {Registry}
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
     */
    registerRequestMethod(type, config) {
        this._requestTypes[type] = Object.assign({type}, config);
    }

    getRequestMethodConfig(type) {
        return this._requestTypes[type];
    }

    /**
     * @todo refactor to getAllRequestMethodConfigs
     * @return {{}}
     */
    getAllRequestMethodConfigs() {
        return this._requestTypes;
    }
}

export default Registry;
