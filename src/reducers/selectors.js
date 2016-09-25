/* eslint arrow-parens: [0] */
/* @flow */
type ReduxState = Object;
type Repository = Object;
type PromiseStateData = Object | Array<Object>;

type PromiseState = {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: PromiseStateData,
};

export const getModel:Repository = (state:ReduxState) => state.repository;

/**
 * getRepository()
 * usage:
 *  - selectors.getRepository('repositoryName')(reduxState)
 *  - selectors.getRepository('repositoryName').fromState(reduxState)
 */
export const getRepository:Function = (repositoryName:string) => {
  const fromState:PromiseStateData = (state:ReduxState) =>
    state.repository[repositoryName] && state.repository[repositoryName].value;
  const ret:PromiseStateData = (state:ReduxState) => fromState(state);
  ret.fromState = fromState;
  return ret;
};

/**
 * getPromise()
 * usage:
 *  - selectors.getPromise('repositoryName')(reduxState)
 *  - selectors.getPromise('repositoryName').fromState(reduxState)
 */
export const getPromise:Function = (repositoryName:string) => {
  const fromState:PromiseState = (state:ReduxState) => state.repository[repositoryName];
  const ret:PromiseState = (state:ReduxState) => fromState(state);
  ret.fromState = fromState;
  return ret;
};
