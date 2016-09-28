import immutable from 'seamless-immutable';
import map from 'lodash/map';
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
      if (action.request.meta && action.request.meta.addToList && state.value) {
        const idName = action.request.meta.addToList.idName;
        const id = action.request.meta.addToList.id;
        const newValue = state.value ? map(state.value, (item) => {
          if (item[idName] === id) {
            return action.value;
          }
          return item;
        }) : [action.value];
        return fetchFulfill(state, Object.assign({}, action, { value: newValue }));
      }

      return fetchFulfill(state, action);
    case FETCH.for('get').REJECT:
      return fetchReject(state, action);
    default:
      return state;
  }
};

export default getReducer;
