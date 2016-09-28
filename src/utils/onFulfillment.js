import merge from 'lodash/merge';
import actions from '../actions';

const onFulfillment = (store, next, action, meta) => value => (
  next(actions.for(action.method).fulfill(merge(action, { value, request: { meta } })))
);

export default onFulfillment;
