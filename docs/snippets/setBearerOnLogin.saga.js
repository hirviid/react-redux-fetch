/* eslint-disable */
import { takeEvery } from 'redux-saga';
import { container, FETCH } from 'react-redux-fetch';

function watchLogin({ key, value }) {
  if (key === 'user') {
    container.registerRequestHeader('Authorization', `Bearer ${value.jwt}`);
  }
}

export default function* setBearerOnLogin() {
  yield takeEvery(FETCH.for('post').FULFILL, watchLogin);
}
