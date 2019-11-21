import {ErrorAction, FetchConfig, Method, RequestAction, SuccessAction, Url} from './types';
import {REQUEST_FULFILLED, REQUEST_REJECTED, REQUEST_STARTED} from './actionTypes';

const createActionType = (actionType: string, url: Url, method: Method = 'GET') => {
  return `${actionType} ${method} ${url}`;
};

export const requestAction = (fetchConfig: FetchConfig): RequestAction => {
  return {
    __type: REQUEST_STARTED,
    type: createActionType(REQUEST_STARTED, fetchConfig.url, fetchConfig.method),
    payload: {
      fetchConfig,
    },
  };
};

export const successAction = (
  fetchConfig: FetchConfig,
  value: any,
  response?: any
): SuccessAction => {
  return {
    __type: REQUEST_FULFILLED,
    type: createActionType(REQUEST_FULFILLED, fetchConfig.url, fetchConfig.method),
    payload: {
      fetchConfig,
      value,
      response,
    },
  };
};

export const errorAction = (
  fetchConfig: FetchConfig,
  reason: any,
  response?: any,
): ErrorAction => {
  return {
    __type: REQUEST_REJECTED,
    type: createActionType(REQUEST_REJECTED, fetchConfig.url, fetchConfig.method),
    payload: {
      fetchConfig,
      reason,
      response,
    },
  };
};
