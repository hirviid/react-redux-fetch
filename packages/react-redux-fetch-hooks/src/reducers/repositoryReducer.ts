import { Reducer } from 'redux';
import { isErrorAction, isRequestAction, isSuccessAction } from '../util/isFetchAction';

export const repositoryReducer: Reducer = (state = {}, action) => {
  if (isRequestAction(action)) {
    const fetchConfig = action.payload.fetchConfig;

    if (fetchConfig.optimistic) {
      return Object.keys(fetchConfig.optimistic).reduce((prevState, key) => {
        return {
          ...prevState,
          [key]: fetchConfig.optimistic![key]!(
              prevState[key],
              fetchConfig.fetchOptions?.body,
              'optimistic'
          ),
        };
      }, state);
    }
  }

  if (isSuccessAction(action)) {
    const fetchConfig = action.payload.fetchConfig;
    const value = action.payload.value;
    const rawResponse = action.payload.response;

    const repositoryValues = fetchConfig.transform ? fetchConfig.transform(value, rawResponse) : {};

    return Object.keys(fetchConfig.repository).reduce((prevState, key) => {
      return {
        ...prevState,
        [key]: fetchConfig.repository[key]!(
          prevState[key],
          typeof repositoryValues[key] !== 'undefined' ? repositoryValues[key] : value,
        ),
      };
    }, state);
  }

  if (isErrorAction(action)) {
    const fetchConfig = action.payload.fetchConfig;

    if (fetchConfig.optimistic) {
      return Object.keys(fetchConfig.optimistic).reduce((prevState, key) => {
        return {
          ...prevState,
          [key]: fetchConfig.optimistic![key]!(
              prevState[key],
              null,
              'rollback'
          ),
        };
      }, state);
    }
  }

  return state;
};
