import React from 'react';
import ProductList from '../ProductList'
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import 'moment/locale/vi'
moment.locale('vi')

const SentMessageCell = ({ conversation }) => {
  if (conversation.type === 'link') {
    conversation.link = conversation.attachment
    conversation.attachment = null
  }
  const attachment = JSON.parse(conversation.attachment)
  return (
    <div className="d-flex flex-nowrap chat-item flex-row-reverse">

      <img className="rounded-circle avatar size-40 align-self-end" src="https://img.icons8.com/carbon-copy/2x/bot.png"
        alt="Bot" />
      {!attachment ?
        <Tooltip title={moment(conversation.time).format('HH:mm, Do MMMM, YYYY')} placement="left">
          <div className="bubble jambo-card">
            {conversation.type === 'link' ? <div className="message"><a target="_blank" href={conversation.link}>{conversation.msgContent}</a></div> : <div className="message">{conversation.msgContent}</div>}
            {/* <div className="time text-muted text-right mt-2">{moment(conversation.time).format('HH:mm, Do MMMM, YYYY')}</div> */}
          </div></Tooltip> :
        <div className="attachments">
          <ProductList attachment={attachment} />
        </div>
      }

    </div>
  )
};

export default SentMessageCell;