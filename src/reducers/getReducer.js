import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import { INIT } from '../constants/request';
import fetchRequest from '../utils/fetchRequest';
import fetchFulfill from '../utils/fetchFulfill';
import fetchReject from '../utils/fetchReject';
import createAddToListAction from '../utils/createAddToListAction';

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
      if (state.value) {
        const newAction = createAddToListAction(state, action);
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
