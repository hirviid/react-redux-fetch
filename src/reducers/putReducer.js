import Immutable from 'seamless-immutable';
import {FETCH} from '../constants/actionTypes';
import {INIT} from '../constants/request';
import fetchRequest from '../utils/fetchRequest';
import fetchFulfill from '../utils/fetchFulfill';

const INITIAL_STATE = {
    ...INIT,
    value: null,
    meta: null
};

const putReducer = (state=Immutable(INITIAL_STATE), action) => {

    switch (action.type) {
        case FETCH.for('put').REQUEST:
            return fetchRequest(state, action);
        case FETCH.for('put').FULFILL:
            return fetchFulfill(state, action);
    }

    return state;

};

export default putReducer;
