// @flow
export type ResourceName = string;

export type Resource = {
  name: ResourceName,
  action?: string,
};

export type Request = {
  url: string,
  meta?: Object,
  comparison?: string,
  force?: boolean,
};

export type reduxAction = {
  type: string,
};

export type PromiseState<T, C = *, M = *> = {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: T,
  reason?: {
    cause: C,
  },
  request: {
    meta: M,
  },
};

export type FulfillAction = {
  type: string,
  key: string,
  value: *,
  reason?: {
    cause: *,
  },
  request: {
    meta?: {
      removeFromList?: {
        path?: string,
        idName: string,
        id?: number | string | Array<number | string>,
      },
      addToList?: {
        path?: string,
        idName: string,
      },
    },
  },
  resource: Resource,
};

export type ReactReduxFetchResource = {
  resource: ResourceName | Resource,
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE',
  request: ((...args: Array<any>) => Request) | Request,
};

export type FetchConfig = (() => Array<ReactReduxFetchResource>) | Array<ReactReduxFetchResource>;
