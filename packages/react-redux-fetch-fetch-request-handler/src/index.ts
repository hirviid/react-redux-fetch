import { RequestHandler } from '@react-redux-fetch/core';
import { handleResponse } from './handleResponse';

type Maybe<T> = T | undefined;
type AnyObject = Record<string, any>;

export type FetchRequestHandlerConfig = {
  responseHandler: <T = any>(response: Response) => Promise<T> | null;
};

const isObject = (maybeObject: any): maybeObject is AnyObject =>
  typeof maybeObject === 'object' && maybeObject !== 0;

const defaultConfig = {
  responseHandler: handleResponse,
};

export const createFetchRequestHandler = (
  config?: FetchRequestHandlerConfig
): RequestHandler => fetchConfig => {
  const conf = {
    ...defaultConfig,
    ...(config || {}),
  };
  const method = (fetchConfig.method || 'GET').toUpperCase();
  const url = fetchConfig.url;
  const options = fetchConfig.fetchOptions || {};

  if (options.body) {
    options.body =
      isObject(options.body) && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body;
  }

  return {
    handle: callback => {
      const request = new Request(url, { method, ...options });
      let response: Maybe<Response>;

      fetch(request)
        .then(_res => {
          response = _res;
          return _res;
        })
        .then(conf.responseHandler)
        .then(
          body => {
            callback(response ? response.status : 0, body, response);
          },
          body => {
            callback(response ? response.status : 0, body, response);
          }
        );
    },
  };
};

export { handleResponse };
