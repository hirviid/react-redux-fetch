/* eslint arrow-parens: [0] */
/* @flow */
type ReduxState = Object;
type Repository = Object;
type PromiseStateData = *;

type PromiseState = {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: PromiseStateData,
};

export const getModel = (state: ReduxState): Repository => state.repository;

/**
 * getRepository()
 * usage:
 *  - selectors.getRepository('repositoryName')(reduxState)
 *  - selectors.getRepository('repositoryName').fromState(reduxState)
 */
export const getRepository = (repositoryName: string) => {
  const fromState = (state: ReduxState): PromiseStateData =>
    state.repository[repositoryName] && state.repository[repositoryName].value;
  const ret = (state: ReduxState): PromiseStateData => fromState(state);
  ret.fromState = fromState;
  return ret;
};

/**
 * getPromise()
 * usage:
 *  - selectors.getPromise('repositoryName')(reduxState)
 *  - selectors.getPromise('repositoryName').fromState(reduxState)
 */
export const getPromise = (repositoryName: string) => {
  const fromState = (state: ReduxState): PromiseState => state.repository[repositoryName];
  const ret = (state: ReduxState): PromiseState => fromState(state);
  ret.fromState = fromState;
  return ret;
};
