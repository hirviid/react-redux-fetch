import { AnyAction } from 'redux';
import {ErrorAction, FetchAction, RequestAction, SuccessAction} from '../types';
import {REQUEST_FULFILLED, REQUEST_REJECTED, REQUEST_STARTED} from '../actionTypes';

export const isFetchAction = (action: AnyAction): action is FetchAction => {
  return action.hasOwnProperty('__type');
};

export const isRequestAction = (action: AnyAction): action is RequestAction => {
  return isFetchAction(action) && action.__type === REQUEST_STARTED;
};

export const isSuccessAction = (action: AnyAction): action is SuccessAction => {
  return isFetchAction(action) && action.__type === REQUEST_FULFILLED;
};

export const isErrorAction = (action: AnyAction): action is ErrorAction => {
  return isFetchAction(action) && action.__type === REQUEST_REJECTED;
};
