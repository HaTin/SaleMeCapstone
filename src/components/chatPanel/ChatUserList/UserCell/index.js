import React from 'react';
import * as moment from 'moment';

const formatDate = (timeString) => {
  const date = moment(timeString)
  return date.fromNow()
}

const UserCell = ({ chat, selectedSectionId, onSelectUser }) => {
  return (
    <div key={chat.id} className={`chat-user-item ${selectedSectionId === chat.id ? 'active' : ''}`} onClick={() => {
      onSelectUser(chat);
    }}>
      <div className="chat-user-row row">
        <div className="chat-avatar col-xl-2 col-3">
          <div className="chat-avatar-mode">
            <img src="https://via.placeholder.com/150x150" className="rounded-circle size-40" alt={chat.userName} />
          </div>
        </div>

        <div className="chat-info col-xl-8 col-6">
          <span className="name h4">{chat.userName}</span>
          <div className="chat-info-des">{chat.lastMessage.length > 30 ? chat.lastMessage.substring(0, 25) + "..." : chat.lastMessage}</div>
          <div className="last-message-time">{formatDate(chat.lastMessageTime)}</div>
        </div>

        <div className="chat-date col-xl-2 col-3">
          <div className="bg-primary rounded-circle badge text-white">{chat.unreadMessage}</div>
        </div>
      </div>
    </div>
  )
};

export default UserCell;