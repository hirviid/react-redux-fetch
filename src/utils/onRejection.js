import merge from 'lodash/merge';
import actions from '../actions';

const onRejection = (store, next, action, meta) => reason => (
  next(actions.for(action.method).reject(
    merge(
      action, {
        reason,
        request: { meta },
      }),
  ))
);

export default onRejection;
