import Immutable from 'seamless-immutable';
import reduce from 'lodash/reduce';
import registry from '../registry';
import {PREFIX} from '../constants/actionTypes';

const INITIAL_STATE = {};


const handleCustomReducers = (state, action) => {
    const additionalReducers = registry.getReducers();

    return reduce(additionalReducers, (s, additionalReducer, key) => {
        if (s.hasOwnProperty(key)) {
            return s.setIn([key], additionalReducer(s[key], action));
        }
        return s;
    }, state);
};

const reducer = (state = Immutable(INITIAL_STATE), action) => {

    const key = action.key;

    // If action has no 'key', or doesn't include our custom prefix, we're not interested and we can return the state
    if (!key || action.type.indexOf(PREFIX) === -1) {
        return handleCustomReducers(state, action);
    }

    const allRequestConfigs = registry.getAllRequestMethodConfigs();

    const stateLeaf = reduce(allRequestConfigs, (s, requestConfig) => {
        return requestConfig.reducer(s, action);
    }, state[key]);

    return handleCustomReducers(state.set(key, stateLeaf), action);

};

export default reducer;
