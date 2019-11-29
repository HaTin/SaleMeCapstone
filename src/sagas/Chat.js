import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { FETCH_ALL_CHAT_USER, FETCH_ALL_CHAT_USER_CONVERSATION, ON_SELECT_USER } from 'constants/ActionTypes';
import { fetchChatUserConversationSuccess, fetchChatUserSuccess, showChatMessage } from 'actions/Chat';
import { chat } from 'services/api'


function* fetchChatUserRequest({ payload }) {
  try {
    const pageNumber = 1
    const rowPage = 10
    const { shopId } = payload
    const response = yield call(chat.getConversations, { shopId, pageNumber, rowPage });
    const { conversations } = response.data
    yield put(fetchChatUserSuccess(conversations));
  } catch (error) {
    yield put(showChatMessage(error));
  }
}

function* fetchChatUserConversationRequest({ payload }) {
  try {
    const { id } = payload
    const response = yield call(chat.getMessages, id);
    console.log(response)
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

export default function* rootSaga() {
  yield all([fork(fetchChatUserConversation), fork(fetchChatUser)]);
}