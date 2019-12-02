import React from 'react';

const ReceivedMessageCell = ({ conversation, user }) => {
  return (
    <div className="d-flex flex-nowrap chat-item">

      <img className="rounded-circle avatar size-40 align-self-end" src="https://icon-library.net/images/default-user-icon/default-user-icon-8.jpg"
        alt="" />

      <div className="bubble">
        <div className="message">{conversation.msgContent}</div>
        {/* <div className="time text-muted text-right mt-2">{conversation.time}</div> */}
      </div>

    </div>
  )
};

export default ReceivedMessageCell;