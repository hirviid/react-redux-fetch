import { RequestHandler } from 'react-redux-fetch-hooks';
import newError from './errors';

type Maybe<T> = T | undefined;
type AnyObject = Record<string, any>;

const isObject = (maybeObject: any): maybeObject is AnyObject =>
    typeof maybeObject === 'object' && maybeObject !== 0;

const handleResponse = (response: Response) => {
    if (response.headers.get('content-length') === '0' || response.status === 204) {
        return response.ok
            ? null
            : Promise.reject(
                newError({ error: response.statusText ? response.statusText : 'Request failed' })
            );
    }

    const json = response.json();

    return response.ok ? json : json.then(cause => Promise.reject(newError(cause)));
};

export const fetchRequestHandler: RequestHandler = fetchConfig => {
    const method = (fetchConfig.method || 'GET').toUpperCase();
    const url = fetchConfig.url;
    const options = fetchConfig.fetchOptions || {};

    if (options.body) {
        options.body =
            isObject(options.body) && !(options.body instanceof FormData)
                ? JSON.stringify(options.body)
                : options.body;
    }

    return {
        handle: callback => {
            const request = new Request(url, { method, ...options });
            let response: Maybe<Response>;

            fetch(request)
                .then(_res => {
                    response = _res;
                    return _res;
                })
                .then(handleResponse)
                .then(
                    body => {
                        callback(response ? response.status : 0, body, response);
                    },
                    body => {
                        callback(response ? response.status : 0, body, response);
                    }
                );
        },
    };
};
