import {FetchAction} from "../types";

export function getRequestStateKey(action: FetchAction): string {
  const fetchConfig = action.payload.fetchConfig;
  return `${fetchConfig.method || 'GET'} ${fetchConfig.url}`;
}
