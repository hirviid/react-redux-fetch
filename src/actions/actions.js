import isFunction from 'lodash/isFunction';
import { FETCH } from '../constants/actionTypes';

export const action = type => (payload = {}) => ({ type, ...payload });

const forMethod = verb => ({
  request: (key, url, request) => action(FETCH.for(verb).REQUEST)({ key, url, request }),
  fulfill: (key, value, meta) => action(FETCH.for(verb).FULFILL)({ key, value, meta }),
  reject: (key, reason, meta) => action(FETCH.for(verb).REJECT)({ key, reason, meta }),
});

const mappingToRequestAction = mapping => (...args) => {
  const requestMethod = mapping.method || 'get';
  const finalConfigFn = mapping.request;
  const finalKey = mapping.resource;

  if (!finalKey) {
    throw new Error('actions.request(): \'resource\' property missing in mapping.');
  }

  const finalConfig = isFunction(finalConfigFn) ? finalConfigFn(...args) : finalConfigFn;
  return forMethod(requestMethod).request(finalKey, finalConfig.url, finalConfig);
};

export default {
  for: forMethod,
  requestActionCreator: mappingToRequestAction,
};
