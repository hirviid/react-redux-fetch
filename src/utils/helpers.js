// @flow
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

type FuncOrObj = Function | Object;

const ensureObject: Function = (item: FuncOrObj, itemArg: Array<*>): Object => {
  // $FlowFixMe
  const obj = isFunction(item) ? item(...itemArg) : item;
  return isObject(obj) ? obj : {};
};

export default {
  ensureObject,
};
