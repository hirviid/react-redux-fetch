/*
 * // @flow
 * react-redux-fetch knows how to handle the following services:
 *     - requestMethods
 *     - requestHeaders
 *     - reducers
 *     - responseHandler (TODO)
 *     - requestBuilder
 */
import Definition from './dependencyInjection/Definition';
import ContainerBuilder from './dependencyInjection/ContainerBuilder';
import fetchRequest from './middleware/fetchRequest';
import getReducer from './reducers/getReducer';
import deleteReducer from './reducers/deleteReducer';
import postReducer from './reducers/postReducer';
import putReducer from './reducers/putReducer';
import requestHeaders from './utils/defaultHeaders';
import requestBuilder from './utils/requestBuilder';
import equals from './utils/equals';
import componentHelpers from './utils/componentHelpers';
import handleResponse from './utils/handleResponse';
import assert from './utils/assert';

class ContainerFacade {

  container: ContainerBuilder;

  constructor() {
    this.container = new ContainerBuilder();
    this.init();
  }

  init() {
    this.container.register('requestMethods', {
      get: {
        method: 'get',
        middleware: fetchRequest,
        reducer: getReducer,
      },
      post: {
        method: 'post',
        middleware: fetchRequest,
        reducer: postReducer,
      },
      put: {
        method: 'put',
        middleware: fetchRequest,
        reducer: putReducer,
      },
      delete: {
        method: 'delete',
        middleware: fetchRequest,
        reducer: deleteReducer,
      },
    });

    this.container.register('requestHeaders', requestHeaders);
    this.container.register('reducers', {});
    this.container.register('requestBuilder', { build: requestBuilder });
    this.container.register('utils', { equals, componentHelpers, handleResponse });
    // container.getDefinition('requestMethods').addArgument('patch', '...');
    // container.getDefinition('requestMethods').addArgument('token', '...');
  }

  getDefinition(...rest: any): Definition {
    return this.container.getDefinition(...rest);
  }

  hasDefinition(...rest: any): boolean {
    return this.container.hasDefinition(...rest);
  }

  getUtil(name: string): Function {
    return this.container.getDefinition('utils').getArgument(name);
  }

  setUtil(name: string, util: any): Definition {
    return this.container.getDefinition('utils').addArgument(name, util);
  }

  /**
   * Facade method to register a reducer at the container
   * @param {String} stateName The name of the state part you want a reducer for
   * @param {Function} reducer The reducer for the state part
   * @return {Definition} A Definition instance
   */
  registerReducer(stateName:string, reducer:Function): Definition {
    return this.container.getDefinition('reducers').addArgument(stateName, reducer);
  }

  /**
   * Facade method to register a request header at the container
   * @param {String} name Header field name (e.g. 'Accept-Encoding')
   * @param {String} value Header field value (e.g. 'application/json')
   * @return {Definition} A Definition instance
   */
  registerRequestHeader(name:string, value:string): Definition {
    return this.container.getDefinition('requestHeaders').addArgument(name, value);
  }

  /**
   * Replace existing request headers
   * @param {Object} newRequestHeaders The new request headers (e.g. {'Accept': 'application/json'})
   * @return {Definition} A Definition instance
   */
  replaceRequestHeaders(newRequestHeaders:Object): Definition {
    return this.container.register('requestHeaders', newRequestHeaders);
  }

  /**
   * Facade method to register a request method at the container
   * @param {String} method The request method to add the config for (e.g. 'post')
   * @param {Object} config The config object ({middleware, reducer})
   * @return {Definition} A Definition instance
   */
  registerRequestMethod(method: string, config: Object): Definition {
    assert.contains(config, 'middleware', `Property 'middleware' is missing from the ${method} request method config.
        You can use fetchRequestMiddleware: import {fetchRequestMiddleware} from 'react-redux-fetch.`);
    assert.contains(config, 'reducer', `Property 'reducer' is missing from the ${method} request method config.
        You should pass a reducer function which handles actions for your ${method} request method.
        See https://github.com/hirviid/react-redux-fetch/blob/master/src/reducers/getReducer.js for an example.`);

    return this.container.getDefinition('requestMethods').addArgument(method, Object.assign({ method }, config));
  }

  /**
   * Facade method to change a specific property of a request method configuration
   * @param {String} method The request method to change the config for (e.g 'post')
   * @param {String} key The config key (e.g. 'reducer')
   * @param {any} value The value to set
   * @return {Definition} A Definition instance
   */
  changeRequestMethodConfig(method: string, key: string, value: any): Definition {
    assert.exists(this.container.getDefinition('requestMethods').getArguments()[method],
      `Nothing to replace, no request method '${method}' registered, use container.registerRequestMethod() to register ${method} requests.`);

    return this.container.getDefinition('requestMethods').replaceArgument(`${method}.${key}`, value);
  }
}

export default new ContainerFacade();
