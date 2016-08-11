
export const getFetchData = (state) => state.fetch;
export const getValue = (state, resource) => state.fetch[resource] && state.fetch[resource].value;
