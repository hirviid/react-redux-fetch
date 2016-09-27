/* eslint-disable */
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { actions } from 'react-redux-fetch';
import { apiRoutes } from 'app/globals';

function* watchSocket() {
  // 'requestActionCreator()' accepts the same mapping as passed to the connect() higher order component
  const requestActionCreator = actions.requestActionCreator({
    resource: 'todos',
    request: {
      url: apiRoutes.getTodos(),
    },
  });
  yield put(requestActionCreator());
}

export default function* refetchTodosOnSocket() {
  yield takeEvery('SOCKET_MSG', watchSocket);
}
