import isObject from 'lodash/isObject';
import registry from '../registry';


const requestBuilder = (url, {body, method='get', headers=registry.getHeaders()} = {}) => {
    return new Request(url, {
        method: method,
        headers: headers,
        body: isObject(body) ? JSON.stringify(body) : body
    });
};

export default requestBuilder;
