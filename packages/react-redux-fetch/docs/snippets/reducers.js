/* eslint-disable */
import { combineReducers } from 'redux';
import { reducer as fetchReducer, container } from 'react-redux-fetch';

function userReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
}

container.registerReducer('user', userReducer);

const rootReducer = combineReducers({
  // ... other reducers
  repository: fetchReducer,
});

export default rootReducer;
