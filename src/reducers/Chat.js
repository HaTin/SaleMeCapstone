import Moment from 'moment';
import users from 'app/routes/Conversation/data/chatUsers';
import conversationList from 'app/routes/Conversation/data/conversationList';
import {
  FETCH_ALL_CHAT_USER_CONVERSATION_SUCCESS,
  FETCH_ALL_CHAT_USER_SUCCESS,
  FETCH_MORE_CHAT_USER_SUCCESS,
  FILTER_CONTACT,
  FILTER_USERS,
  ON_HIDE_LOADER,
  ON_SELECT_USER,
  SET_STATE,
  ON_TOGGLE_DRAWER,
  SHOW_MESSAGE,
  SUBMIT_COMMENT,
  UPDATE_MESSAGE_VALUE,
  ON_SHOW_USER_LOADER,
  REMOVE_CHAT_USER_SUCCESS,
  UPDATE_SEARCH_CHAT_USER,
  REMOVE_CHAT_USER_FAILED,
  SEARCH_CHAT_USER_SUCCESS
} from 'constants/ActionTypes';
import { USER_INFO_STATE } from '../constants/ActionTypes';


const INIT_STATE = {
  loader: true,
  pageNumber: 1,
  userLoader: false,
  userNotFound: 'No user found',
  drawerState: false,
  selectedSectionId: '',
  userState: 1,
  searchChatUser: '',
  selectedUser: null,
  message: '',
  end: false,
  chatUsers: [],
  conversationList: [], //ony for prod
  // chatUsers: users.filter((user) => user.recent),
  // conversationList: conversationList,
  conversation: null
};


export default (state = INIT_STATE, action) => {

  switch (action.type) {
    case FILTER_USERS: {
      if (action.payload === '') {
        return {
          ...state, chatUsers: users.filter(user => !user.recent)
        }
      } else {
        return {
          ...state, chatUsers: users.filter((user) =>
            !user.recent && user.name.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
          )
        }
      }
    }
    case ON_SHOW_USER_LOADER: {
      return {
        ...state,
        userLoader: true
      }
    }
    case REMOVE_CHAT_USER_SUCCESS: {
      return {
        ...state,
        chatUsers: [...state.chatUsers.filter(chat => chat.id !== action.payload.id)],
        deleteSuccess: true
      }
    }
    case REMOVE_CHAT_USER_FAILED: {
      return {
        ...state,
        message: action.payload.errorMessage,
        deleteFailed: true
      }
    }
    case SET_STATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    case ON_SELECT_USER: {
      return {
        ...state,
        loader: true,
        drawerState: false,
        selectedSectionId: action.payload.id,
        selectedUser: action.payload,
        // conversation: state.conversationList.find((data) => data.id === action.payload.id)
      }
    }
    case ON_TOGGLE_DRAWER: {
      return { ...state, drawerState: !state.drawerState }
    }
    case ON_HIDE_LOADER: {
      return { ...state, loader: false }
    }
    case USER_INFO_STATE: {
      return { ...state, userState: action.payload }
    }

    case SUBMIT_COMMENT: {
      const updatedConversation = state.conversation.conversationData.concat({
        'type': 'sent',
        'message': state.message,
        'sentAt': Moment().format('hh:mm:ss A'),
      });

      return {
        ...state,
        conversation: {
          ...state.conversation, conversationData: updatedConversation
        },
        message: '',
        conversationList: state.conversationList.map(conversationData => {
          if (conversationData.id === state.conversation.id) {
            return { ...state.conversation, conversationData: updatedConversation };
          } else {
            return conversationData;
          }
        })

      }
    }
    case SEARCH_CHAT_USER_SUCCESS: {
      return { ...state, searchResults: action.payload, isSearching: true }
    }

    case UPDATE_MESSAGE_VALUE: {
      return { ...state, message: action.payload }
    }

    case UPDATE_SEARCH_CHAT_USER: {
      return { ...state, searchChatUser: action.payload }
    }

    case FETCH_ALL_CHAT_USER_SUCCESS: {
      return {
        ...state,
        chatUsers: action.payload.conversations,
        pageNumber: action.payload.pageNumber,
        loader: false,
        drawerState: true,
        end: false
      }
    }
    case FETCH_MORE_CHAT_USER_SUCCESS: {
      return {
        ...state,
        chatUsers: [...state.chatUsers, ...action.payload.conversations],
        pageNumber: action.payload.pageNumber,
        end: action.payload.end,
        loader: false,
        userLoader: false
      }
    }
    case FETCH_ALL_CHAT_USER_CONVERSATION_SUCCESS: {
      return {
        ...state,
        conversation: action.payload,
        loader: false,
      }
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false
      }
    }
    default:
      return state;
  }
}
