import newError from "./errors";

export const handleResponse = (response: Response) => {
    if (response.headers.get('content-length') === '0' || response.status === 204) {
        return response.ok
            ? null
            : Promise.reject(
                newError({error: response.statusText ? response.statusText : 'Request failed'})
            );
    }

    const json = response.json();

    return response.ok ? json : json.then(cause => Promise.reject(newError(cause)));
};
