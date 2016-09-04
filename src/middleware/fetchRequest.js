import container from '../container';
import handleResponse from '../utils/handleResponse';
import onFulfillment from '../utils/onFulfillment';
import onRejection from '../utils/onRejection';

const fetchRequest = (store, next, action, config) => {
    const req = container.getDefinition('requestBuilder').getArgument('build')(action.url, {method: config.method, body: action.request.body});
    let meta = action.request.meta || {};
    next(action);

    return fetch(req).then(function (response) {
        meta.response = response;
        return response;
    }).then(handleResponse).then(onFulfillment(store, next, action, meta, config.method), onRejection(store, next, action, meta, config.method));
};

export default fetchRequest;
