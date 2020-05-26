import { AnyAction } from 'redux';

type AnyObject = Record<string, any>;

export type StatusCode = number;
export type UnixDateTime = number;
export type Method = string;
export type Url = string;
export type TransformFn = (prev: any, next: any) => any;
export type OptimisticFn = (prev: any, next: any, phase: 'optimistic' | 'rollback') => any;

export interface FetchConfig<Repository = AnyObject> {
  method?: Method;
  url: Url;
  repository: Partial<Record<keyof Repository, TransformFn>>;
  transform?: (responseValue: any, rawResponse?: any) => Partial<Record<keyof Repository, any>>;
  optimistic?: Partial<Record<keyof Repository, OptimisticFn>>;
  fetchOptions?: Record<string, any>;
}

export interface FetchAction extends AnyAction {
  __type: string;
  payload: Record<string, any>;
}

export interface RequestAction extends FetchAction {
  payload: { fetchConfig: FetchConfig };
}

export interface SuccessAction extends FetchAction {
  payload: { fetchConfig: FetchConfig; value: any; response: any };
}

export interface ErrorAction extends FetchAction {
  payload: { fetchConfig: FetchConfig; response: any; reason: any };
}

export interface CancelAction extends FetchAction {
  payload: { fetchConfig: FetchConfig };
}

export interface PendingPromiseState {
  pending: true;
  fulfilled: false;
  rejected: false;
  requestCount: number;
  lastSuccessAt?: UnixDateTime;
  response?: any;
  lastErrorAt?: UnixDateTime;
  reason?: any;
}

export interface SuccessPromiseState {
  pending: false;
  fulfilled: true;
  rejected: false;
  requestCount: number;
  lastSuccessAt: UnixDateTime;
  response: unknown;
}

export interface ErrorPromiseState<TReason = any> {
  pending: false;
  fulfilled: false;
  rejected: true;
  requestCount: number;
  lastErrorAt: UnixDateTime;
  reason: TReason;
  response: unknown;
}

export type PromiseState = PendingPromiseState | SuccessPromiseState | ErrorPromiseState;

export type Callback = (statusCode: StatusCode, responseBody: any, rawResponse?: any) => void;

export type RequestHandler = (
    fetchConfig: FetchConfig
) => {
  handle: (callback: Callback) => void;
  abort: () => void;
};

export interface ReactReduxFetchConfig {
  requestHandler: RequestHandler;
}

export interface ReactReduxFetchState {
  requests: Record<string, PromiseState>
}
