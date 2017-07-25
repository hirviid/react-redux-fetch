// @flow
import immutable from 'seamless-immutable';
import at from 'lodash/at';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import type { PromiseState, FulfillAction } from '../types';

export default function createAddToListAction(
  state: PromiseState,
  action: FulfillAction,
): FulfillAction {
  if (action.request.meta && action.request.meta.addToList) {
    const { path, idName } = action.request.meta.addToList;
    const stateValue = path ? at(state.value, path)[0] : state.value;
    const actionValue = path ? at(action.value, path)[0] : action.value;
    const actionValueList = !isArray(actionValue) ? [actionValue] : actionValue;
    const itemsAdded = [];

    if (!isArray(stateValue)) {
      throw Error("Cannot use 'meta.addToList' if the value in the state is not an array!");
    }

    const newValue = reduce(
      stateValue,
      (s, item) => {
        const itemFromActionValueList = find(actionValueList, { [idName]: item[idName] });
        if (itemFromActionValueList) {
          itemsAdded.push(itemFromActionValueList[idName]);
        }
        const newS = [...s, itemFromActionValueList || item];
        return newS;
      },
      [],
    );

    const itemsToAppend = filter(actionValueList, o => itemsAdded.indexOf(o[idName]) === -1);

    const finalValue = [...newValue, ...itemsToAppend];

    return Object.assign({}, action, {
      value: path
        ? immutable.from(state.value).setIn(path.split('.'), finalValue, { deep: true })
        : finalValue,
    });
  }

  return action;
}
