import immutable from 'seamless-immutable';
import filter from 'lodash/filter';
import { FETCH } from '../constants/actionTypes';
import { INIT } from '../constants/request';
import fetchRequest from '../utils/fetchRequest';
import fetchFulfill from '../utils/fetchFulfill';
import fetchReject from '../utils/fetchReject';

const INITIAL_STATE = {
  ...INIT,
  value: null,
  meta: null,
};

const deleteReducer = (state = immutable(INITIAL_STATE), action) => {
  switch (action.type) {
    case FETCH.for('delete').REQUEST:
      return fetchRequest(state, action);
    case FETCH.for('delete').FULFILL:
      if (action.meta && action.meta.removeFromList && state.value) {
        const idName = action.meta.removeFromList.idName;
        const id = action.meta.removeFromList.id;
        const val = filter(state.value, value => value[idName] !== id);
        return fetchFulfill(state, Object.assign({}, action, { value: val }));
      }

      return fetchFulfill(state, action);
    case FETCH.for('get').REJECT:
      return fetchReject(state, action);
    default:
      return state;
  }
};

export default deleteReducer;
