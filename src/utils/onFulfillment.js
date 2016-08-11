import actions from '../actions';

const onFulfillment = (store, next, action, meta, requestType) => (value) => {
    return next(actions.for(requestType).fulfill(
        action.key,
        value,
        meta
    ));
};

export default onFulfillment;
