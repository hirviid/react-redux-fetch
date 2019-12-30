import { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestAction } from './lib/actions';
import { getRequestStateKey } from './lib/util';
import { FetchConfig, PromiseState } from './lib';

type Options = {
  debugKey?: string;
  eager?: boolean;
};

export const useMemoize = <TValue>(func: () => TValue, deps = []) => {
  const ref = useRef<any>();

  useEffect(() => {
    return (): any => (ref.current = {});
  }, deps);

  if (!ref.current) {
    ref.current = func();
  }

  return ref.current;

  // return useCallback(
  //   function(this: any) {
  //
  //     if (!ref.current) {
  //       ref.current = func();
  //     }
  //
  //     return ref.current;
  //   },
  //   [func]
  // );
};

export function useFetch<TMakeRequestParams extends Array<any>>(
  makeFetchConfig: (...args: TMakeRequestParams) => FetchConfig,
  options: Options = {}
): [PromiseState | undefined, (...args: TMakeRequestParams) => void] {
  const { eager, debugKey } = options;

  debugKey && console.count(`${(debugKey) || ''} useFetch`);
  const dispatch = useDispatch();

  // When makeFetchConfig doesn't expect any arguments, we can already create the action and requestStateKey
  const preAction =
    makeFetchConfig.length === 0
      // @ts-ignore
      ? useMemoize(() => requestAction(makeFetchConfig()), [makeFetchConfig])
      : null;
  const initialRequestStateKey = preAction ? getRequestStateKey(preAction) : '';
  const [requestStateKey, setRequestStateKey] = useState(initialRequestStateKey);
  // @ts-ignore
  const promiseState = useSelector(state => state.requests[requestStateKey]);

  const request = useCallback(
    (...args: TMakeRequestParams) => {
      if (preAction) {
        dispatch(preAction);
        return;
      }

      const fetchConfig = makeFetchConfig(...args);
      const action = requestAction(fetchConfig);
      setRequestStateKey(getRequestStateKey(action));

      dispatch(action);
    },
    [preAction, makeFetchConfig, dispatch]
  );

  useEffect(() => {
    if (eager) {
      // @ts-ignore
      request();
    }
  },[request, eager]);
  // console.log('promiseStates', promiseStates);
  // const promiseState = ({} as unknown) as PromiseState<TResponse>;

  return [promiseState, request];
}
