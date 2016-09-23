import isObject from 'lodash/isObject';
import container from '../container';


const requestBuilder = (url, { body, method = 'get', headers = container.getDefinition('requestHeaders').getArguments() } = {}) => (
  new Request(url, {
    method,
    headers,
    body: isObject(body) ? JSON.stringify(body) : body,
  })
);

export default requestBuilder;
