import buildRequest from '../utils/buildRequest';
import handleResponse from '../utils/handleResponse';
import onFulfillment from '../utils/onFulfillment';
import onRejection from '../utils/onRejection';

const fetchRequest = (store, next, action, config) => {
    const req = buildRequest(action.url, {method: config.type, body: action.request.body});
    let meta = action.request.meta || {};
    next(action);

    return fetch(req).then(function (response) {
        meta.response = response;
        return response;
    }).then(handleResponse).then(onFulfillment(store, next, action, meta, config.type), onRejection(store, next, action, meta));
};

export default fetchRequest;
