export const getModel = state => state.repository;

export const getRepository = repositoryName => ({
  fromState: state => state.repository[repositoryName] && state.repository[repositoryName].value,
});
export const getPromise = repositoryName => ({
  fromState: state => state.repository[repositoryName],
});
