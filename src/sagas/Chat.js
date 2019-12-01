import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { FETCH_ALL_CHAT_USER, FETCH_ALL_CHAT_USER_CONVERSATION, ON_SELECT_USER, FETCH_MORE_CHAT_USER, ON_SHOW_USER_LOADER } from 'constants/ActionTypes';
import {
  fetchChatUserConversationSuccess,
  fetchChatUserSuccess,
  showChatMessage,
  fetchMoreChatUser,
  showUserLoader,
  fetchMoreChatUserSuccess
} from 'actions/Chat';
import { chat } from 'services/api'
const rowPage = 8
function* fetchChatUserRequest({ payload }) {
  try {
    console.log('fetch-user')

    const { shopId, pageNumber } = payload
    const response = yield call(chat.getConversations, { shopId, pageNumber, rowPage });
    const { conversations } = response.data
    yield put(fetchChatUserSuccess({ conversations, pageNumber: response.data.pageNumber }));
  } catch (error) {
    yield put(showChatMessage(error));
  }
}

function* fetchMoreChatUserRequest({ payload }) {
  try {
    yield put(showUserLoader())
    const { shopId, pageNumber } = payload
    const response = yield call(chat.getConversations, { shopId, pageNumber, rowPage });
    const { conversations, end } = response.data
    yield put(fetchMoreChatUserSuccess({ conversations, pageNumber: response.data.pageNumber, end }));
  } catch (error) {
    yield put(showChatMessage(error));
  }
}

function* fetchChatUserConversationRequest({ payload }) {
  try {
    const { id } = payload
    const response = yield call(chat.getMessages, id);
    const { messages } = response.data
    yield put(fetchChatUserConversationSuccess(messages));
  } catch (error) {
    yield put(showChatMessage(error));
  }
}

export function* fetchChatUser() {
  yield takeEvery(FETCH_ALL_CHAT_USER, fetchChatUserRequest);
}

export function* fetchChatUserConversation() {
  yield takeEvery(ON_SELECT_USER, fetchChatUserConversationRequest);
}

export function* fetchMoreChatUsers() {
  yield takeLatest(FETCH_MORE_CHAT_USER, fetchMoreChatUserRequest);
}

// export default function* rootSaga() {
//   yield all([fetchChatUserConversation,
//     fetchChatUser, fetchMoreChatUsers]);
// }

export default function* rootSaga() {
  yield all([fork(fetchChatUserConversation),
  fork(fetchChatUser),
  fork(fetchMoreChatUsers)]);
}