import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { database } from '../firebase/firebase';
import { FETCH_ALL_CHAT_USER, FETCH_ALL_CHAT_USER_CONVERSATION, ON_SELECT_USER } from 'constants/ActionTypes';
import { fetchChatUserConversationSuccess, fetchChatUserSuccess, showChatMessage } from 'actions/Chat';
import { chat } from 'services/api'

const getChatUsers = async () =>
  await database.ref('prod/chat/users').once('value')
    .then((snapshot) => {
      const chatUsers = [];
      snapshot.forEach((rawData) => {
        chatUsers.push(rawData.val());
      });
      return chatUsers;
    })
    .catch(error => error);

const getUsersConversation = async () =>
  await database.ref('prod/chat/conversation').once('value')
    .then((snapshot) => {
      const conversations = [];
      snapshot.forEach((rawData) => {
        const conversation = rawData.val();

        // change object to array
        const conversationDatas = [];
        if (conversation.conversationData) {
          conversation.conversationData.forEach((conversationData) =>
            conversationDatas.push(conversationData)
          );
        }
        conversation.conversationData = conversationDatas;
        conversations.push(conversation);
      });

      return conversations;
    })
    .catch(error => error);


function* fetchChatUserRequest({ payload }) {
  try {
    const { storeId } = payload
    const response = yield call(chat.getConversations, storeId);
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