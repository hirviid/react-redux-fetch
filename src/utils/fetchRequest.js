import immutable from 'seamless-immutable';
import { PENDING } from '../constants/request';

const fetchRequest = (state) => {
  if (state.value) {
    return state.merge(PENDING);
  }
  return immutable(PENDING);
};

export default fetchRequest;
