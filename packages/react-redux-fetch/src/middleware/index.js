import each from 'lodash/each';
import { FETCH } from '../constants/actionTypes';
import container from '../container';

export default store => next => (action) => {
  const methodConfigs = container.getDefinition('requestMethods').getArguments();

  next(action);

  each(methodConfigs, (config, method) => {
    if (action.type === FETCH.for(method).REQUEST && config.middleware) {
      // if (!config.middleware) {
      //     throw `Warning: Request for method ${method} has no matching middleware.`;
      // }
      config.middleware(store, next, action, config);
    }
  });
};
