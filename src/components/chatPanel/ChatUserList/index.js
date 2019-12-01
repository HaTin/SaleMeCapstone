import React from 'react';
import UserCell from "./UserCell/index";
import LongMenu from './long/LongMenu'

const ChatUserList = ({ chatUsers, selectedSectionId, onSelectUser, handleOption }) => {
  return (
    <div className="chat-user">
      {chatUsers.map((chat, index) =>
        <UserCell key={index} chat={chat} selectedSectionId={selectedSectionId} onSelectUser={onSelectUser} handleOption={handleOption.bind(this, chat)} />
      )}
    </div>
  )
};

export default ChatUserList;