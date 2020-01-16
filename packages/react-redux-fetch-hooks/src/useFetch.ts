import { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchConfig, PromiseState, ReactReduxFetchState } from '@react-redux-fetch/core';
import { requestAction } from '@react-redux-fetch/core/dist/actions';
import { getRequestStateKey } from '@react-redux-fetch/core/dist/util/getRequestStateKey';

type Options = {
  debugKey?: string;
  eager?: boolean;
  pollInterval?: number;
};

type MakeFetchConfig<TMakeRequestParams extends Array<any>> =
  | ((...args: TMakeRequestParams) => FetchConfig | null)
  | (() => FetchConfig | null);

export function useFetch<TMakeRequestParams extends Array<any>>(
  makeFetchConfig: MakeFetchConfig<TMakeRequestParams>,
  options: Options = {}
): [PromiseState | undefined, (...args: TMakeRequestParams) => void] {
  const { eager, debugKey } = options;

  debugKey && console.count(`${debugKey || ''} useFetch`);
  const dispatch = useDispatch();

  const savedMakeFetchConfig = useRef<MakeFetchConfig<TMakeRequestParams>>(() => null);

  const [requestStateKey, setRequestStateKey] = useState();
  const promiseState = useSelector(
    (state: ReactReduxFetchState) => state.requests[requestStateKey]
  );

  const request = useCallback(
    (...args: TMakeRequestParams) => {
      console.log(args);
      const fetchConfig = savedMakeFetchConfig.current(...args);

      if (!fetchConfig) {
        return;
      }

      const action = requestAction(fetchConfig);
      setRequestStateKey(getRequestStateKey(action));

      dispatch(action);
    },
    [dispatch]
  );

  // Remember the latest callback.
  useEffect(() => {
    savedMakeFetchConfig.current = makeFetchConfig;
  }, [makeFetchConfig]);

  useEffect(() => {
    if (options.pollInterval && (!promiseState || promiseState.fulfilled)) {
      if (savedMakeFetchConfig.current.length !== 0) {
        console.warn('Cannot start polling: Your fetch function requires parameters.');
        return;
      }
      const t = setTimeout(() => {
        // @ts-ignore
        request();
      }, options.pollInterval);

      return () => clearTimeout(t);
    }
  }, [options.pollInterval, request, promiseState]);

  useEffect(() => {
    if (eager) {
      if (savedMakeFetchConfig.current.length !== 0) {
        console.warn('Cannot fetch eagerly: Your fetch function requires parameters.');
        return;
      }

      // @ts-ignore
      request();
    }
  }, [request, eager]);

  return [promiseState, request];
}
