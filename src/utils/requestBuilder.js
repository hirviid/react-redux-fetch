import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import container from '../container';

const requestBuilder = (
  url,
  options,
) => {
  const headers = options.headers;
  const finalHeaders = isFunction(headers)
    ? headers(container.getDefinition('requestHeaders').getArguments())
    : headers;

  const body = options.body;
  const finalBody = isObject(body) && !(body instanceof FormData) ? JSON.stringify(body) : body;

  return new Request(url, {
    ...options,
    headers: finalHeaders,
    body: finalBody,
  });
};

export default requestBuilder;
