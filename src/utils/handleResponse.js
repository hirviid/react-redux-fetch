import newError from './errors';

const handleResponse = (response) => {
  if (response.headers.get('content-length') === '0' || response.status === 204) {
    return response.ok
      ? null
      : Promise.reject(newError(response.statusText ? response.statusText : 'Request failed'));
  }

  const json = response.json();

  return response.ok
    ? json
    : json.then(cause => (
        Promise.reject(newError(cause))
      ));
};

export default handleResponse;
