import React from 'react';
import moment from 'moment';
import 'moment/locale/vi'
import Tooltip from '@material-ui/core/Tooltip';
moment.locale('vi')


const ReceivedMessageCell = ({ conversation, user }) => {
  return (
    <div className="d-flex flex-nowrap chat-item">

      <img className="rounded-circle avatar size-40 align-self-end" src="https://icon-library.net/images/default-user-icon/default-user-icon-8.jpg"
        alt="" />
      <Tooltip title={moment(conversation.time).format('HH:mm, Do MMMM, YYYY')} placement="right">
        <div className="bubble">
          <div className="message">{conversation.msgContent}</div>
        </div>
      </Tooltip>

    </div>
  )
};

export default ReceivedMessageCell;