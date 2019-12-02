import React from 'react';
import ProductList from '../ProductList'

const SentMessageCell = ({ conversation }) => {
  if (conversation.type === 'link') {
    conversation.link = conversation.attachment
    conversation.attachment = null
  }
  const attachment = JSON.parse(conversation.attachment)
  console.log(attachment)
  return (
    <div className="d-flex flex-nowrap chat-item flex-row-reverse">

      <img className="rounded-circle avatar size-40 align-self-end" src="https://img.icons8.com/carbon-copy/2x/bot.png"
        alt="Bot" />
      {!attachment ?
        <div className="bubble jambo-card">
          {conversation.type === 'link' ? <div className="message"><a target="_blank" href={conversation.link}>{conversation.msgContent}</a></div> : <div className="message">{conversation.msgContent}</div>}
        </div> :
        <div className="attachments">
          <ProductList attachment={attachment} />
        </div>
      }
      {/* <div className="time text-muted text-right mt-2">{conversation.time}</div> */}

    </div>
  )
};

export default SentMessageCell;