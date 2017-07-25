// @flow
import immutable from 'seamless-immutable';
import at from 'lodash/at';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import find from 'lodash/find';
import type { PromiseState, FulfillAction } from '../types';

export default function createAddToListAction(
  state: PromiseState,
  action: FulfillAction,
): FulfillAction {
  if (action.request.meta && action.request.meta.removeFromList) {
    const { path, idName, id } = action.request.meta.removeFromList;
    // state.value
    const stateValue = path ? at(state.value, path)[0] : state.value;
    // action.value
    const actionValue = path ? at(action.value, path)[0] : action.value;
    // [action.value]
    const actionValueList = !isArray(actionValue) ? [actionValue] : actionValue;
    // meta.removeFromList.id
    const idsInMeta = id ? id instanceof Array ? id : [id] : []; // eslint-disable-line

    if (!isArray(stateValue)) {
      throw Error("Cannot use 'meta.removeFromList' if the value in the state is not an array!");
    }

    const newStateValue = filter(
      stateValue,
      item =>
        !find(actionValueList, { [idName]: item[idName] }) && idsInMeta.indexOf(item[idName]) === -1, // eslint-disable-line max-len
    );

    return Object.assign({}, action, {
      value: path
        ? immutable.from(state.value).setIn(path.split('.'), newStateValue, { deep: true })
        : newStateValue,
    });
  }
  return action;
}
