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

interface Resource {
  name: string;
  action?: string;
}

type ResourceType = string | Resource;

interface Request {
  url: string;
  body?: Object;
  meta?: Object;
  comparison?: any;
  force?: boolean;
}

export interface Reducer {
  [key: string]: PromiseState
}

export interface PromiseState {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: any,
  meta: any
}

type RequestType = Request | ((...args: any[]) => Request);

export interface FetchConfig {
  resource: ResourceType;
  method?: string;
  request: RequestType;
}

type FetchConfigType<TProps> = ((props: TProps, context: any) => FetchConfig[]) | FetchConfig[];

type Children = DispatchFunctions & FetchData;

type DispatchFunctions = {
  [key: string]: () => void;
}

type FetchData = {
  [key: string]: PromiseState
}

export type ReduxFetchProps = {
  config: Array<FetchConfig>;
  children: (children: Children) => React.ReactNode;
  onFulfil?: (key: string, state: PromiseState, dispatchFunctions: object) => void;
  onReject?: (key: string, state: PromiseState, dispatchFunctions: object) => void;
}

export class ReduxFetch extends React.Component<ReduxFetchProps>{}

export function connect(fetchItems: FetchConfigType<any>[]): RR.InferableComponentEnhancer<FetchConfigType<any>[]>;

export function connect<TStateProps, TDispatchProps = {}, TOwnProps = {}, State = {}>(
  fetchItems: FetchConfigType<TStateProps & TDispatchProps & TOwnProps>,
  mapStateToProps?: RR.MapStateToProps<TStateProps, TOwnProps, State> | RR.MapStateToPropsFactory<TStateProps, TOwnProps, State>,
  mapDispatchToProps?: RR.MapDispatchToProps<TDispatchProps, TOwnProps> | RR.MapDispatchToPropsFactory<TDispatchProps, TOwnProps>,
): RR.InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;

export default connect;


