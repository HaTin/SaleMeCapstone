import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { FETCH_ALL_CHAT_USER, FETCH_ALL_CHAT_USER_CONVERSATION, ON_SELECT_USER, FETCH_MORE_CHAT_USER, ON_SHOW_USER_LOADER, REMOVE_CHAT_USER, SEARCH_CHAT_USER } from 'constants/ActionTypes';
import {
  fetchChatUserConversationSuccess,
  fetchChatUserSuccess,
  showChatMessage,
  fetchMoreChatUser,
  removeChatUser,
  removeChatUserSuccess,
  showUserLoader,
  fetchMoreChatUserSuccess,
  setState,
  searchChatUserSuccess
} from 'actions/Chat';
import { chat } from 'services/api'
const defaultErrorMessage = 'Có lỗi đã xảy ra, Vui lòng thử lại'
const rowPage = 8
function* fetchChatUserRequest({ payload }) {
  try {
    const { shopId, pageNumber } = payload
    const response = yield call(chat.getConversations, { shopId, pageNumber, rowPage });
    const { conversations, total } = response.data
    yield put(fetchChatUserSuccess({ conversations, pageNumber: response.data.pageNumber, total }));
  } catch (error) {
    yield put(showChatMessage(defaultErrorMessage));
  }
}

function* removeChatUserRequest({ payload }) {
  try {
    const response = yield call(chat.deleteConversation, payload)
    yield put(removeChatUserSuccess(response.data))
  } catch (error) {
    const errorMessage = error.response.data || 'Error'
    yield put(showChatMessage(errorMessage));
  }
}

function* fetchMoreChatUserRequest({ payload }) {
  try {
    yield put(showUserLoader())
    const { shopId, pageNumber, deletedCount } = payload
    const response = yield call(chat.getConversations, { shopId, pageNumber, rowPage, deletedCount });
    const { conversations, end, total } = response.data
    yield put(fetchMoreChatUserSuccess({ conversations, pageNumber: response.data.pageNumber, end, total }));
  } catch (error) {
    yield put(showChatMessage(defaultErrorMessage));
  }
}

function* fetchChatUserConversationRequest({ payload }) {
  try {
    const { id } = payload
    const response = yield call(chat.getMessages, id);
    const { messages } = response.data
    yield put(fetchChatUserConversationSuccess(messages));
  } catch (error) {
    yield put(showChatMessage(defaultErrorMessage));
  }
}

function* searchConversationRequest({ payload }) {
  try {
    if (payload.search) {
      const response = yield call(chat.searchMessage, payload);
      yield put(searchChatUserSuccess(response.data.conversations))
    } else {
      yield put(setState({ isSearching: false }))
    }
    // yield put(searchChatUserSuccess(response.data));
  } catch (error) {
    yield put(showChatMessage(defaultErrorMessage));
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

export function* removeChatUserSaga() {
  yield takeLatest(REMOVE_CHAT_USER, removeChatUserRequest)
}

export function* searchMessageSaga() {
  yield takeLatest(SEARCH_CHAT_USER, searchConversationRequest)
}
// export default function* rootSaga() {
//   yield all([fetchChatUserConversation,
//     fetchChatUser, fetchMoreChatUsers]);
// }

export default function* rootSaga() {
  yield all([fork(fetchChatUserConversation),
  fork(fetchChatUser),
  fork(removeChatUserSaga),
  fork(fetchMoreChatUsers),
  fork(searchMessageSaga)]);
}