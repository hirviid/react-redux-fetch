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

const postReducer = (state=Immutable(INITIAL_STATE), action) => {

    switch (action.type) {
        case FETCH.for('post').REQUEST:
            return fetchRequest(state, action);
        case FETCH.for('post').FULFILL:
            return fetchFulfill(state, action);
    }

    return state;

};

export default postReducer;
