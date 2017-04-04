declare module 'react-redux-fetch' {
  import * as React from 'react';
  import * as RR from 'react-redux';

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

  export function reducer();
  export function middleware();
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

  type RequestType = Request | ((...args: any[]) => Request);

  interface FetchConfig {
    resource: ResourceType;
    method?: string;
    request: RequestType;
  }

  type FetchConfigType<TProps> = ((props: TProps, context: any) => FetchConfig[]) | FetchConfig[];

  export function connect(fetchItems: FetchConfigType<any>[]): RR.InferableComponentDecorator;

  export function connect<TStateProps, TDispatchProps, TOwnProps>(
    fetchItems: FetchConfigType<TStateProps & TDispatchProps & TOwnProps>,
    mapStateToProps?: RR.MapStateToProps<TStateProps, TOwnProps> | RR.MapStateToPropsFactory<TStateProps, TOwnProps>,
    mapDispatchToProps?: RR.MapDispatchToProps<TDispatchProps, TOwnProps> | RR.MapDispatchToPropsFactory<TDispatchProps, TOwnProps>,
  ) : RR.ComponentDecorator<TStateProps & TDispatchProps, TOwnProps>;

  export default connect;
}
