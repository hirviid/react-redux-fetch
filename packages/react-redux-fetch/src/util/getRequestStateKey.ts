import {FetchConfig} from "../types";

export function getRequestStateKey(fetchConfig: FetchConfig): string {
  return `${fetchConfig.method || 'GET'} ${fetchConfig.url}`;
}
