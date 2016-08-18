import Immutable from 'seamless-immutable';
import reduce from 'lodash/reduce';
import container from '../container';
import {PREFIX} from '../constants/actionTypes';

const INITIAL_STATE = {};


const handleCustomReducers = (state, action) => {
    if (!container.hasDefinition('reducers')) {
        return state;
    }

    const additionalReducers = container.getDefinition('reducers');

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

    const allRequestConfigs = container.getDefinition('requestMethods').getArguments();

    const stateLeaf = reduce(allRequestConfigs, (s, requestConfig) => {
        return requestConfig.reducer(s, action);
    }, state[key]);

    return handleCustomReducers(state.set(key, stateLeaf), action);

};

export default reducer;
