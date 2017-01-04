import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

const ensureObject = (item, itemArg) => {
  const obj = isFunction(item) ? item(...itemArg) : item;
  return isObject(obj) ? obj : {};
};

export default {
  ensureObject,
};
