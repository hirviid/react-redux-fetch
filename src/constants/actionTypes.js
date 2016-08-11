export const PREFIX = 'react-redux-fetch/';

export const FETCH = {
    for: (verb) => ({
        REQUEST: `${PREFIX}${verb.toUpperCase()}_REQUEST`,
        FULFILL: `${PREFIX}${verb.toUpperCase()}_FULFIL`,
        REJECT: `${PREFIX}${verb.toUpperCase()}_REJECT`
    })
};
