import newError from './errors';

const handleResponse = (response) => {
  if (response.headers.get('content-length') === '0' || response.status === 204) {
    return null;
  }

  const json = response.json();

  return (response.status >= 200 && response.status < 300) ?
    json
    :
    json.then(cause => (
      Promise.reject(newError(cause))
    ));
};

export default handleResponse;
