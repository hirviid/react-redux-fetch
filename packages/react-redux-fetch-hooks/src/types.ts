import { FetchConfig } from '@react-redux-fetch/core';

export type Options = {
  debugKey?: string;
  eager?: boolean;
  pollInterval?: number;
};

export type MakeFetchConfig<TMakeRequestParams extends Array<any>> =
  | ((...args: TMakeRequestParams) => FetchConfig | null)
  | (() => FetchConfig | null);
