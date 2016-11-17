import immutable from 'seamless-immutable';
import at from 'lodash/at';
import set from 'lodash/set';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import { FETCH } from '../constants/actionTypes';
import { INIT } from '../constants/request';
import fetchRequest from '../utils/fetchRequest';
import fetchFulfill from '../utils/fetchFulfill';
import fetchReject from '../utils/fetchReject';

const INITIAL_STATE = {
  ...INIT,
  value: null,
  request: { meta: null },
};

const getReducer = (state = immutable(INITIAL_STATE), action) => {
  switch (action.type) {
    case FETCH.for('get').REQUEST:
      return fetchRequest(state, action);
    case FETCH.for('get').FULFILL:
      // TODO: extract this out of the reducer
      if (action.request.meta && action.request.meta.addToList && state.value) {
        const { path, idName } = action.request.meta.addToList;
        const stateValue = path ? at(state.value, path)[0] : state.value;
        const actionValue = path ? at(action.value, path)[0] : action.value;
        const actionValueList = !isArray(actionValue) ? [actionValue] : actionValue;
        const itemsAdded = [];

        if (!isArray(stateValue)) {
          throw Error('Cannot use \'meta.addToList\' if the value in the state is not an array!');
        }

        const newValue = reduce(stateValue, (s, item) => {
          const itemFromActionValueList = find(actionValueList, { [idName]: item[idName] });
          if (itemFromActionValueList) {
            itemsAdded.push(itemFromActionValueList[idName]);
          }
          const newS = [...s, itemFromActionValueList || item];
          return newS;
        }, []);

        const itemsToAppend = filter(actionValueList, o => itemsAdded.indexOf(o[idName]) === -1);

        const finalValue = [...newValue, ...itemsToAppend];

        const newAction = Object.assign(
          {},
          action,
          { value: path ? set({}, path, finalValue) : finalValue }
        );

        return fetchFulfill(state, newAction);
      }

      return fetchFulfill(state, action);
    case FETCH.for('get').REJECT:
      return fetchReject(state, action);
    default:
      return state;
  }
};

export default getReducer;
