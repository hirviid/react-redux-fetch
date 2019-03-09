import * as RR from 'react-redux';
import * as React from 'react';

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
  registerRequestMethod: (method: string, args: { method: string, middleware: Function, reducer: Function }) => Definition;
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

interface Request extends RequestInit {
  url: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
  meta?: Object;
  comparison?: any;
  force?: boolean;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  integrity?: string;
  keepalive?: boolean;
  method?: string;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  window?: any;
}

export interface Reducer {
  [key: string]: PromiseState
}

export interface PromiseState<T = any, C = any, M = any> {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value?: T,
  reason?: {
    cause: C,
  },
  meta?: {
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
  onFulfil?: (key: string, state: PromiseState, dispatchFunctions: object) => void;
  onReject?: (key: string, state: PromiseState, dispatchFunctions: object) => void;
  fetchOnMount?: boolean | Array<Resource>,
}

export function buildActionsFromMappings(config: Array<FetchConfig>): {[key: string]: (...args: any[]) => FetchAction};

export var ReduxFetch: React.ComponentType<ReduxFetchProps>;

export function connect(fetchItems: FetchConfigType<any>[]): RR.InferableComponentEnhancer<FetchConfigType<any>[]>;

export function connect<TStateProps, TDispatchProps = {}, TOwnProps = {}, State = {}>(
  fetchItems: FetchConfigType<TStateProps & TDispatchProps & TOwnProps>,
  mapStateToProps?: RR.MapStateToProps<TStateProps, TOwnProps, State> | RR.MapStateToPropsFactory<TStateProps, TOwnProps, State>,
  mapDispatchToProps?: RR.MapDispatchToProps<TDispatchProps, TOwnProps> | RR.MapDispatchToPropsFactory<TDispatchProps, TOwnProps>,
): RR.InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;

export default connect;


