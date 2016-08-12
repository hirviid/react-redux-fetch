import {FETCH} from '../constants/actionTypes';
import registry from '../registry';

export default (store) => (next) => (action) => {

    const methodConfigs = registry.getAllRequestMethodConfigs();

    for (let method in methodConfigs) {
        if (methodConfigs.hasOwnProperty(method)) {
            let config = methodConfigs[method];

            if (action.method === FETCH.for(method).REQUEST && config.middleware) {
                // if (!config.middleware) {
                //     throw `Warning: Request for method ${method} has no matching middleware.`;
                // }
                return config.middleware(store, next, action, config);
            }
        }

    }

    return next(action);
};
