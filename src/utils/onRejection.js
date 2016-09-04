import actions from '../actions';

const onRejection = (store, next, action, meta, requestType) => (reason) => {
    return next(actions.for(requestType).reject(
        action.key,
        reason,
        meta
    ));
};

export default onRejection;
