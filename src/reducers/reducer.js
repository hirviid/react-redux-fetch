import immutable from 'seamless-immutable';
import reduce from 'lodash/reduce';
import container from '../container';
import { PREFIX, CLEAR } from '../constants/actionTypes';

const INITIAL_STATE = {};

const handleCustomReducers = (state, action) => {
  if (!container.hasDefinition('reducers')) {
    return state;
  }

  const additionalReducers = container.getDefinition('reducers').getArguments();

  return reduce(
    additionalReducers,
    (s, additionalReducer, key) => {
      if (s[key]) {
        return s.setIn([key], additionalReducer(s[key], action));
      }
      return s;
    },
    state,
  );
};

const reducer = (state = immutable(INITIAL_STATE), action) => {
  const resourceName = action.resource && action.resource.name;
  const immutableState = immutable.isImmutable(state) ? state : immutable(state);

  // If action has no 'resourceName', or doesn't include our custom prefix,
  // we're not interested and we can return the state
  if (!resourceName || action.type.indexOf(PREFIX) === -1) {
    return handleCustomReducers(immutableState, action);
  }

  // If clearing a repository
  if (action.type === CLEAR) {
    return immutableState.without(resourceName);
  }

  // Otherwise
  const allRequestConfigs = container.getDefinition('requestMethods').getArguments();

  const stateLeaf = reduce(
    allRequestConfigs,
    (s, requestConfig) => requestConfig.reducer(s, action),
    immutableState[resourceName],
  );

  return handleCustomReducers(immutableState.set(resourceName, stateLeaf), action);
};

export default reducer;
