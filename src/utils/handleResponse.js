import newError from './errors';

const handleResponse = (response) => {
    if (response.headers.get('content-length') === '0' || response.status === 204) {
        return;
    }

    let json = response.json();

    if (response.status >= 200 && response.status < 300) {
        return json;
    } else {
        return json.then(function (cause) {
            return Promise.reject(newError(cause));
        });
    }
};

export default handleResponse;
