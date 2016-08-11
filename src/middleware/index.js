import {FETCH} from '../constants/actionTypes';
import registry from '../registry';

export default (store) => (next) => (action) => {

    const types = registry.getAllRequestMethodConfigs();

    for (let type in types) {
        if (types.hasOwnProperty(type)) {
            let config = types[type];

            if (action.type === FETCH.for(type).REQUEST && config.middleware) {
                // if (!config.middleware) {
                //     throw `Warning: Request for type ${type} has no matching middleware.`;
                // }
                return config.middleware(store, next, action, config);
            }
        }

    }

    return next(action);
};
