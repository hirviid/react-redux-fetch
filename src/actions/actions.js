import omit from 'lodash/fp/omit';
import { FETCH } from '../constants/actionTypes';

const omitType = omit('type');

export const action = type => (payload = {}) => ({ type, ...payload });

const forMethod = verb => ({
  request: data => action(FETCH.for(verb).REQUEST)(omitType(data)),
  fulfill: data => action(FETCH.for(verb).FULFILL)(omitType(data)),
  reject: data => action(FETCH.for(verb).REJECT)(omitType(data)),
});

export default {
  for: forMethod,
};
