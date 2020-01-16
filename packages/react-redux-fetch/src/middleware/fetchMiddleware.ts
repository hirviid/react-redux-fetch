import { Middleware } from 'redux';
import { ReactReduxFetchConfig } from '../types';
import { isRequestAction } from '../util/isFetchAction';
import { errorAction, successAction } from '../actions';

type FetchMiddleware = (config: ReactReduxFetchConfig) => Middleware;

export const fetchMiddleware: FetchMiddleware = config => store => next => action => {
  if (isRequestAction(action)) {
    const fetchConfig = action.payload.fetchConfig;

    config.requestHandler(fetchConfig).handle((statusCode, responseBody, rawResponse) => {
      if (statusCode >= 200 && statusCode < 300) {
        store.dispatch(successAction(fetchConfig, responseBody, rawResponse));
      } else {
        store.dispatch(errorAction(fetchConfig, responseBody, rawResponse));
      }
    });
  }

  next(action);
};
