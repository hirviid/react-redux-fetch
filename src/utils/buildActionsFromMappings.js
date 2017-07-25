// @flow
import reduce from 'lodash/fp/reduce';
import capitalizeFirstLetter from './capitalizeFirstLetter';
import container from '../container';
import reactReduxFetchActions from '../actions';

const defaultRequestType = 'get';
const comparisonCache = {};

type RequestMethodConfig = {
  method: string,
  middleware: Function,
  reducer: Function,
};

type Resource = {
  name: string,
  action?: string,
};

type Request = {
  url: string,
  meta?: Object,
  comparison?: string,
  force?: boolean,
};

type Mapping = {
  resource: string | Resource,
  request: Function | Request,
  method: string,
};

type RequestAction = {
  type: string,
  method: string,
  request: Request,
  resource: Resource,
};

function requestMethodToActionKey(key: string, requestMethod: string = defaultRequestType): string {
  const finalRequestMethod: string = requestMethod.toLowerCase();
  const finalKey: string = key;

  const requestMethodConfig: RequestMethodConfig = container
    .getDefinition('requestMethods')
    .getArgument(finalRequestMethod);

  if (!requestMethodConfig) {
    throw new Error(
      `Request method ${finalRequestMethod} not registered at react-redux-fetch. Use container.registerRequestMethod().`,
    );
  }

  return `${finalKey}${capitalizeFirstLetter(requestMethodConfig.method)}`;
}

export function ensureResourceIsObject(mapping: Mapping): Resource {
  if (typeof mapping.resource === 'string') {
    return {
      name: mapping.resource,
    };
  }
  return mapping.resource;
}

export function validateResourceObject(resource: Resource) {
  if (!resource.name) {
    throw new Error(
      `'resource' property is missing or invalid in react-redux-fetch mapping.
    Make sure you have {resource:'yourResourceName'} or {resource:{name:'yourResourceName'}} defined in your mapping.`,
    );
  }
}

function actionFromMapping(mapping: Mapping): { name: string, fn: Function } {
  const finalRequestFn: Request | Function = mapping.request;
  const resource: Resource = ensureResourceIsObject(mapping);
  validateResourceObject(resource);

  const finalResourceName: string = resource.name;
  const requestMethod: string = mapping.method || defaultRequestType;
  const actionKey: string = requestMethodToActionKey(
    resource.action || finalResourceName,
    requestMethod,
  );

  const actionFn = (...args): ?RequestAction => {
    const finalRequest = typeof finalRequestFn === 'function'
      ? finalRequestFn(...args)
      : finalRequestFn;

    const action = finalRequest.force ||
      !container.getUtil('equals')(comparisonCache[actionKey], finalRequest.comparison)
      ? reactReduxFetchActions.for(requestMethod).request(
          Object.assign({}, mapping, {
            method: requestMethod,
            request: finalRequest,
            resource,
          }),
        )
      : null;

    comparisonCache[actionKey] = finalRequest.comparison;

    return action;
  };

  return {
    name: actionKey,
    fn: actionFn,
  };
}

export default function buildActionsFromMappings(mappings: Array<Mapping>): Object {
  const actionsBuilder = reduce(
    (actions: Object, mapping: Mapping) => {
      const action = actionFromMapping(mapping);
      return Object.assign(actions, { [action.name]: action.fn });
    },
    {},
  );

  return actionsBuilder(mappings);
}
