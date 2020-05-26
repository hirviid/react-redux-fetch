import { repositoryReducer } from './reducers/repositoryReducer';
import { requestReducer } from './reducers/requestReducer';
import { fetchMiddleware } from './middleware/fetchMiddleware';
import {
  isFetchAction,
  isRequestAction,
  isSuccessAction,
  isErrorAction,
} from './util/isFetchAction';
import * as promiseState from './util/promiseState';
export * from './util/getRequestStateKey';
export * from './types';

export {
  repositoryReducer,
  requestReducer,
  fetchMiddleware,
  isFetchAction,
  isRequestAction,
  isSuccessAction,
  isErrorAction,
  promiseState,
};
