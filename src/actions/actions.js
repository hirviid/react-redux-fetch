import { FETCH } from '../constants/actionTypes';

const action = type => (payload={}) => ({type, ...payload});

export default {
    for : (verb) => ({
        request     : (key, url, request) => action(FETCH.for(verb).REQUEST)({key, url, request}),
        fulfill     : (key, value, meta) => action(FETCH.for(verb).FULFILL)({key, value, meta}),
        reject      : (key, url, request) => action(FETCH.for(verb).REJECT)({key, url, request})
    })
};
