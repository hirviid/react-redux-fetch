import immutable from 'seamless-immutable';
import { PENDING } from '../constants/request';

const fetchRequest = (state, action) => {
  if (state.value) {
    return state.merge(PENDING).setIn(['meta'], action.request.meta);
  }
  return immutable(PENDING).setIn(['meta'], action.request.meta);
};

export default fetchRequest;
