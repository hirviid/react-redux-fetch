// @flow
import at from 'lodash/at';
import set from 'lodash/set';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import find from 'lodash/find';
import type { PromiseState, FulfillAction } from '../types';

export default function createAddToListAction(
  state: PromiseState,
  action: FulfillAction
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
    const idsInMeta = !isArray(id) ? [id] : id;

    if (!isArray(stateValue)) {
      throw Error('Cannot use \'meta.removeFromList\' if the value in the state is not an array!');
    }

    const newStateValue = filter(stateValue, item =>
      !find(actionValueList, { [idName]: item[idName] })
        && idsInMeta.indexOf(item[idName]) === -1
    );

    return Object.assign(
      {},
      action,
      { value: path ? set({}, path, newStateValue) : newStateValue }
    );
  }
  return action;
}
