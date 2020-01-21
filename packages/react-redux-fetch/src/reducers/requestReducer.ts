import {Reducer} from 'redux';
import {isErrorAction, isRequestAction, isSuccessAction} from '../util/isFetchAction';
import {getRequestStateKey} from "../util/getRequestStateKey";
import {PromiseState} from "../types";

export const requestReducer: Reducer = (state = {}, action): Record<string, PromiseState> => {
  if (isRequestAction(action)) {
    const requestKey = getRequestStateKey(action.payload.fetchConfig);
    return {
      ...state,
      [requestKey]: {
        ...state[requestKey],
        pending: true,
        fulfilled: false,
        rejected: false,
        requestCount: state[requestKey] ? state[requestKey].requestCount + 1 : 1,
      },
    };
  }

  if (isSuccessAction(action)) {
    const successKey = getRequestStateKey(action.payload.fetchConfig);
    return {
      ...state,
      [successKey]: {
        pending: false,
        fulfilled: true,
        rejected: false,
        requestCount: state[successKey].requestCount,
        response: action.payload.response,
        lastSuccessAt: (new Date()).getTime(),
      },
    };
  }

  if (isErrorAction(action)) {
    const errorKey = getRequestStateKey(action.payload.fetchConfig);
    return {
      ...state,
      [errorKey]: {
        pending: false,
        fulfilled: false,
        rejected: true,
        requestCount: state[errorKey].requestCount,
        reason: action.payload.reason,
        lastErrorAt: (new Date()).getTime(),
      }
    }
  }

  return state;
};
