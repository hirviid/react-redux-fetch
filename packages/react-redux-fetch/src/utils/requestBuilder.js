import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import container from '../container';

const requestBuilder = (
  url,
  { body, method = 'get', headers = container.getDefinition('requestHeaders').getArguments() } = {},
) => {
  const finalHeaders = isFunction(headers)
    ? headers(container.getDefinition('requestHeaders').getArguments())
    : headers;

  return new Request(url, {
    method,
    headers: finalHeaders,
    body: isObject(body) && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });
};

export default requestBuilder;
