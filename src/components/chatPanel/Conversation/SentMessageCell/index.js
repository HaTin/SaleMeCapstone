import React from 'react';

const SentMessageCell = ({ conversation }) => {
  return (
    <div className="d-flex flex-nowrap chat-item flex-row-reverse">

      <img className="rounded-circle avatar size-40 align-self-end" src="https://via.placeholder.com/150x150"
        alt="Bot" />

      <div className="bubble jambo-card">
        <div className="message">{conversation.msgContent}</div>
        {/* <div className="time text-muted text-right mt-2">{conversation.time}</div> */}
      </div>

    </div>
  )
};

export default SentMessageCell;