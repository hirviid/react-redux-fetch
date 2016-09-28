/* eslint-disable */
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { buildActionsFromMappings } from 'react-redux-fetch';
import { apiRoutes } from 'app/globals';

function* watchSocket() {
  // 'buildActionsFromMappings()' accepts the same mapping as passed to the connect() higher order component
  const actions = buildActionsFromMappings([{
    resource: 'todos',
    request: {
      url: apiRoutes.getTodos(),
    },
  }]);
  yield put(actions.todosGet());
}

export default function* refetchTodosOnSocket() {
  yield takeEvery('SOCKET_MSG', watchSocket);
}
