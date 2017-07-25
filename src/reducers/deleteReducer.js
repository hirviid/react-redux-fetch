import immutable from 'seamless-immutable';
import { FETCH } from '../constants/actionTypes';
import { INIT } from '../constants/request';
import fetchRequest from '../utils/fetchRequest';
import fetchFulfill from '../utils/fetchFulfill';
import fetchReject from '../utils/fetchReject';
import createRemoveFromListAction from '../utils/createRemoveFromListAction';

const INITIAL_STATE = {
  ...INIT,
  value: null,
  request: { meta: null },
};

const deleteReducer = (state = immutable(INITIAL_STATE), action) => {
  switch (action.type) {
    case FETCH.for('delete').REQUEST:
      return fetchRequest(state, action);
    case FETCH.for('delete').FULFILL:
      if (action.request.meta && action.request.meta.removeFromList && state.value) {
        const newAction = createRemoveFromListAction(state, action);
        return fetchFulfill(state, newAction);
      }

      return fetchFulfill(state, action);
    case FETCH.for('delete').REJECT:
      return fetchReject(state, action);
    default:
      return state;
  }
};

export default deleteReducer;
