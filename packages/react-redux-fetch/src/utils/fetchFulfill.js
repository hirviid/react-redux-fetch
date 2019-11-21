import { FULFILLED } from '../constants/request';
import responseToObject from './responseToObject';

const fetchFulfill = (state, action) => state
    .merge(FULFILLED)
    .setIn(['value'], action.value)
    .setIn(['meta'], action.request.meta)
    .setIn(['meta', 'response'], responseToObject(action.request.meta.response));


export default fetchFulfill;
