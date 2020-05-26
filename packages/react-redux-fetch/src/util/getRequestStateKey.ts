import {FetchConfig} from "../types";

export function getRequestStateKey(fetchConfig: FetchConfig): string {
  return fetchConfig.requestKey || `${fetchConfig.method || 'GET'} ${fetchConfig.url}`;
}
