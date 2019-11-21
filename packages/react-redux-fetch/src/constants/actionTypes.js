// @flow
export const PREFIX:string = 'react-redux-fetch/';

export const FETCH:Object = {
  for: verb => ({
    REQUEST: `${PREFIX}${verb.toUpperCase()}_REQUEST`,
    FULFILL: `${PREFIX}${verb.toUpperCase()}_FULFIL`,
    REJECT: `${PREFIX}${verb.toUpperCase()}_REJECT`,
  }),
};

export const CLEAR:string = `${PREFIX}CLEAR`;
