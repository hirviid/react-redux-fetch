// @flow
import connect from './components/connect';

import container from './container';
import middleware from './middleware';
import fetchRequestMiddleware from './middleware/fetchRequest';
import reducer from './reducers';
import actions from './actions';
import { FETCH } from './constants/actionTypes';
import * as selectors from './reducers/selectors';
import buildActionsFromMappings from './utils/buildActionsFromMappings';

export {
  container,
  middleware,
  fetchRequestMiddleware,
  reducer,
  actions,
  FETCH,
  selectors,
  buildActionsFromMappings,
};

export default connect;
