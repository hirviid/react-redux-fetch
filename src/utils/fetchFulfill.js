import { FULFILLED } from '../constants/request';

const fetchFulfill = (state, action) =>
  state
    .merge(FULFILLED)
    .setIn(['value'], action.value)
    .setIn(['meta'], action.request.meta);

export default fetchFulfill;
