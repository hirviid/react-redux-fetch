import { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FetchConfig,
  PromiseState,
  ReactReduxFetchState,
  getRequestStateKey,
} from '@react-redux-fetch/core';
import { requestAction, cancelAction } from '@react-redux-fetch/core/dist/actions';
import { MakeFetchConfig, Options } from './types';

export function useFetch<TMakeRequestParams extends Array<any>>(
  makeFetchConfig: MakeFetchConfig<TMakeRequestParams>,
  options: Options = {}
): [PromiseState | undefined, (...args: TMakeRequestParams) => void, () => void] {
  const { eager, debugKey } = options;

  debugKey && console.count(`${debugKey || ''} useFetch`);
  const dispatch = useDispatch();

  const savedMakeFetchConfig = useRef<MakeFetchConfig<TMakeRequestParams>>(() => null);
  const savedFetchConfig = useRef<FetchConfig | null>();

  const [requestStateKey, setRequestStateKey] = useState<string>();
  const promiseState = useSelector(
    (state: ReactReduxFetchState) => requestStateKey ? state.requests[requestStateKey] : undefined
  );

  const request = useCallback(
    (...args: TMakeRequestParams) => {
      savedFetchConfig.current = savedMakeFetchConfig.current(...args);

      if (!savedFetchConfig.current) {
        return;
      }

      const action = requestAction(savedFetchConfig.current);
      setRequestStateKey(getRequestStateKey(savedFetchConfig.current));

      dispatch(action);
    },
    [dispatch]
  );

  const cancel = useCallback(() => {
    if (!savedFetchConfig.current) {
      return;
    }

    const action = cancelAction(savedFetchConfig.current);
    setRequestStateKey(getRequestStateKey(savedFetchConfig.current));

    dispatch(action);
  }, [dispatch]);

  // Remember the latest callback.
  useEffect(() => {
    savedMakeFetchConfig.current = makeFetchConfig;
    if (savedMakeFetchConfig.current.length === 0) {
      savedFetchConfig.current = makeFetchConfig();
      if (savedFetchConfig.current?.requestKey) {
        setRequestStateKey(savedFetchConfig.current.requestKey);
      }
    }
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

  return [promiseState, request, cancel];
}
