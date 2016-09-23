import {REJECTED} from '../constants/request';

const fetchFulfill = (state, action) => {
    return state
                .merge(REJECTED)
                .setIn(['reason'], action.reason)
                .setIn(['meta'], action.meta)
                .setIn(['meta', 'status'], action.meta.response && action.meta.response.status);
};

export default fetchFulfill;
