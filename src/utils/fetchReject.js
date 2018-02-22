import { REJECTED } from '../constants/request';
import responseToObject from './responseToObject';

const fetchFulfill = (state, action) =>
  state
    .merge(REJECTED)
    .setIn(['reason'], action.reason)
    .setIn(['meta'], action.request.meta)
    .setIn(['meta', 'response'], responseToObject(action.request.meta.response))
    .setIn(['meta', 'status'], action.request.meta.response && action.request.meta.response.status);

export default fetchFulfill;
