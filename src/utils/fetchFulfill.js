import {FULFILLED} from '../constants/request';
import Immutable from 'seamless-immutable';

const fetchFulfill = (state, action) => {
    return state
                .merge(FULFILLED)
                .setIn(['value'], action.value)
                .setIn(['meta'], action.meta);
};

export default fetchFulfill;
