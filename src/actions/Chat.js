import {
  FETCH_ALL_CHAT_USER,
  FETCH_ALL_CHAT_USER_CONVERSATION,
  FETCH_ALL_CHAT_USER_CONVERSATION_SUCCESS,
  FETCH_ALL_CHAT_USER_SUCCESS,
  FILTER_CONTACT,
  FILTER_USERS,
  ON_HIDE_LOADER,
  ON_SELECT_USER,
  ON_TOGGLE_DRAWER,
  SHOW_MESSAGE,
  SUBMIT_COMMENT,
  UPDATE_MESSAGE_VALUE,
  UPDATE_SEARCH_CHAT_USER,
  USER_INFO_STATE,
  FETCH_MORE_CHAT_USER,
  FETCH_MORE_CHAT_USER_SUCCESS,
  ON_SHOW_USER_LOADER,
  REMOVE_CHAT_USER,
  REMOVE_CHAT_USER_SUCCESS,
  SET_STATE
} from 'constants/ActionTypes';

export const fetchChatUser = (payload) => {
  return {
    type: FETCH_ALL_CHAT_USER,
    payload: payload
  };
};

export const fetchMoreChatUser = (payload) => {
  return {
    type: FETCH_MORE_CHAT_USER,
    payload: payload
  };
};
export const fetchMoreChatUserSuccess = (payload) => {
  return {
    type: FETCH_MORE_CHAT_USER_SUCCESS,
    payload
  }
};

export const fetchChatUserConversation = (conversationId) => {
  return {
    type: FETCH_ALL_CHAT_USER_CONVERSATION,
    payload: conversationId
  };
};

export const fetchChatUserSuccess = (mails) => {
  return {
    type: FETCH_ALL_CHAT_USER_SUCCESS,
    payload: mails
  }
};
export const fetchChatUserConversationSuccess = (mails) => {
  return {
    type: FETCH_ALL_CHAT_USER_CONVERSATION_SUCCESS,
    payload: mails
  }
};

export const showChatMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const filterContacts = (userName) => {
  return {
    type: FILTER_CONTACT,
    payload: userName
  };
};

export const filterUsers = (userName) => {
  return {
    type: FILTER_USERS,
    payload: userName
  };
};


export const onSelectUser = (user) => {
  return {
    type: ON_SELECT_USER,
    payload: user
  };
};



export const submitComment = () => {
  return {
    type: SUBMIT_COMMENT,
  };
};

export const hideLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};

export const removeChatUser = (id) => {
  return {
    type: REMOVE_CHAT_USER,
    payload: id
  };
};


export const setState = (payload) => {
  return {
    type: SET_STATE,
    payload
  }
}

export const removeChatUserSuccess = (payload) => {
  return {
    type: REMOVE_CHAT_USER_SUCCESS,
    payload
  };
}


export const showUserLoader = () => {
  return {
    type: ON_SHOW_USER_LOADER,
  };
};

export const userInfoState = (state) => {
  return {
    type: USER_INFO_STATE,
    payload: state
  };
};

export const updateMessageValue = (message) => {
  return {
    type: UPDATE_MESSAGE_VALUE,
    payload: message
  };
};


export const updateSearchChatUser = (userName) => {
  return {
    type: UPDATE_SEARCH_CHAT_USER,
    payload: userName
  };
};
export const onChatToggleDrawer = () => {
  return {
    type: ON_TOGGLE_DRAWER
  };
};