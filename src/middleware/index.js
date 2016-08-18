import {FETCH} from '../constants/actionTypes';
import container from '../container';

export default (store) => (next) => (action) => {
    const methodConfigs = container.getDefinition('requestMethods').getArguments();

    for (let method in methodConfigs) {
        if (methodConfigs.hasOwnProperty(method)) {
            let config = methodConfigs[method];

            if (action.type === FETCH.for(method).REQUEST && config.middleware) {
                // if (!config.middleware) {
                //     throw `Warning: Request for method ${method} has no matching middleware.`;
                // }
                return config.middleware(store, next, action, config);
            }
        }

    }

    return next(action);
};
