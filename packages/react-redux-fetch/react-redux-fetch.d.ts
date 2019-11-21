import {Reducer as ReduxReducer, AnyAction as ReduxAction, Middleware, Dispatch} from 'redux';
import { Immutable } from 'seamless-immutable';
import * as RR from 'react-redux';
import * as React from 'react';

export interface RequestMethodConfig {
  method: string;
  middleware: (store: any, next: Dispatch<ReduxAction>, action: ReduxAction, config: RequestMethodConfig) => Promise<any>;
  reducer: ReduxReducer;
}

interface Definition {
  replaceArgument: (path: string, arg: any) => Definition;
  addArgument: (key: string, arg: any) => Definition;
  getArguments: () => Object;
  getArgument: (key: string) => any;
}

interface Container {
  changeRequestMethodConfig: (method: string, key: string, value: any) => Definition;
  getDefinition: (name: string) => Definition;
  registerReducer: (name: string, reducer: Function) => Definition;
  registerRequestHeader: (name: string, value: string) => Definition;
  registerRequestMethod: (method: string, args: RequestMethodConfig) => Definition;
  replaceRequestHeaders: (headers: Object) => Definition;
}

export function reducer(): Reducer;

export function middleware(): () => () => () => void;

export const container: Container;

type ResourceName = string;

interface Resource {
  name: ResourceName;
  action?: string;
}

type ResourceType = ResourceName | Resource;

type Headers = {[key: string]: string};

interface Request {
  url: string;
  body?: Object;
  headers?: Headers | ((headers: Headers) => Headers);
  meta?: Object;
  comparison?: any;
  force?: boolean;
  clearValueOnRequest?: boolean;
}

export type Reducer = Immutable<{
  [key: string]: PromiseState
}>

export interface PromiseState<T = any, C = any, M = any> {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value?: T,
  reason?: {
    cause: C,
  },
  meta?: M & {
    status: number,
    response: {
      headers: Headers,
      ok: boolean,
      status: number,
      statusText: string,
    }
  },
  request?: {
    meta: M,
  },
}

export type FetchAction<TValue = any> = PromiseState<TValue> & {
  type: string;
  resource: Resource;
};

type RequestType = Request | ((...args: any[]) => Request);

export interface FetchConfig {
  resource: ResourceType;
  method?: string;
  request: RequestType;
}

type FetchConfigType<TProps> = ((props: TProps, context: any) => FetchConfig[]) | FetchConfig[];

type DispatchFunctions = {
  [key: string]: (...args: any[]) => void;
}

type FetchData = {
  [key: string]: PromiseState
}

export type ReduxFetchRenderProps = DispatchFunctions & FetchData;

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode
  render?: (props: T) => React.ReactNode
}

export interface ReduxFetchProps extends RenderableProps<ReduxFetchRenderProps> {
  config: Array<FetchConfig>;
  onFulfil?: (key: string, state: PromiseState, dispatchFunctions: DispatchFunctions) => void;
  onReject?: (key: string, state: PromiseState, dispatchFunctions: DispatchFunctions) => void;
  fetchOnMount?: boolean | Array<ResourceName>,
}

export function buildActionsFromMappings(config: Array<FetchConfig>): {[key: string]: (...args: any[]) => FetchAction};

export var ReduxFetch: React.ComponentType<ReduxFetchProps>;

export const FETCH: {
  for: (verb: string) => {
    REQUEST: string,
    FULFILL: string,
    REJECT: string,
  }
};

export const actions: {
  for: (verb: string) => {
    request: (data: any) => FetchAction,
    fulfill: (data: any) => FetchAction,
    reject: (data: any) => FetchAction,
  },
  clear: (resourceName: ResourceName) => {
    type: string,
    resource: {
      name: ResourceName
    }
  }
};

export const selectors: {
  getRepository: <TValue>(resourceName: ResourceName) => {
    fromState: (state: any) => TValue | undefined
  },
  getPromise: <TValue>(resourceName: ResourceName) => {
    fromState: (state: any) => PromiseState<TValue> | undefined
  },
};

export function connect(fetchItems: FetchConfigType<any>[]): RR.InferableComponentEnhancer<FetchConfigType<any>[]>;

export function connect<TStateProps, TDispatchProps = {}, TOwnProps = {}, State = {}>(
  fetchItems: FetchConfigType<TStateProps & TDispatchProps & TOwnProps>,
  mapStateToProps?: RR.MapStateToProps<TStateProps, TOwnProps, State> | RR.MapStateToPropsFactory<TStateProps, TOwnProps, State>,
  mapDispatchToProps?: RR.MapDispatchToProps<TDispatchProps, TOwnProps> | RR.MapDispatchToPropsFactory<TDispatchProps, TOwnProps>,
): RR.InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;

export default connect;


