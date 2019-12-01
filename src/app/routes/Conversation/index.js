import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import Drawer from '@material-ui/core/Drawer';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import ChatUserList from 'components/chatPanel/ChatUserList/index';
import Conversation from 'components/chatPanel/Conversation/index';
import ContactList from 'components/chatPanel/ContactList/index';
import SearchBox from 'components/SearchBox';
import IntlMessages from 'util/IntlMessages';
import Swal from 'sweetalert2'
import {
  fetchChatUser,
  fetchChatUserConversation,
  fetchMoreChatUser,
  filterUsers,
  hideLoader,
  onChatToggleDrawer,
  onSelectUser,
  submitComment,
  updateMessageValue,
  updateSearchChatUser,
  setState,
  removeChatUser,
  userInfoState
} from 'actions/Chat'
import CustomScrollbars from 'util/CustomScrollbars';
// import { auth } from 'firebase/firebase';

class ChatPanelWithRedux extends Component {

  filterUsers = (userName) => {
    this.props.filterUsers(userName);
  };
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitComment();
    }
  };

  onSelectUser = (user) => {
    this.props.onSelectUser(user);
    // setTimeout(() => {
    //   this.props.hideLoader();
    // }, 500);
  };


  submitComment = () => {
    if (this.props.message !== '') {
      this.props.submitComment();
    }
  };

  updateMessageValue = (evt) => {
    this.props.updateMessageValue(evt.target.value);

  };

  Communication = () => {
    const { message, selectedUser, conversation } = this.props;
    // const { conversationData } = conversation;

    return <div className="chat-main">
      <div className="chat-main-header">
        <IconButton className="d-block d-xl-none chat-btn" aria-label="Menu"
          onClick={this.onChatToggleDrawer.bind(this)}>
          <i className="zmdi zmdi-comment-text" />
        </IconButton>
        <div className="chat-main-header-info">

          <div className="chat-avatar mr-2">
            <div className="chat-avatar-mode">
              <img src="https://via.placeholder.com/150x150"
                className="rounded-circle size-60"
                alt="" />

              {/* <span className={`chat-mode ${selectedUser.status}`} /> */}
            </div>
          </div>

          <div className="chat-contact-name">
            {selectedUser.userName}
          </div>
        </div>

      </div>

      <CustomScrollbars className="chat-list-scroll scrollbar">
        <Conversation conversationData={conversation}
          selectedUser={selectedUser} />
      </CustomScrollbars>

      {/* <div className="chat-main-footer">
        <div className="d-flex flex-row align-items-center" style={{ maxHeight: 51 }}>
          <div className="col">
            <div className="form-group">
              <textarea
                id="required" className="border-0 form-control chat-textarea"
                onKeyUp={this._handleKeyPress.bind(this)}
                onChange={this.updateMessageValue.bind(this)}
                value={message}
                placeholder="Type and hit enter to send message"
              />
            </div>
          </div>
          <div className="chat-sent">
            <IconButton
              onClick={this.submitComment.bind(this)}
              aria-label="Send message">
              <i className="zmdi  zmdi-mail-send" />
            </IconButton>
          </div>
        </div>
      </div> */}
    </div>
  };

  ChatUsers = () => {
    return <div className="chat-sidenav-main">
      <div className="chat-sidenav-header">
        <div className="chat-user-hd">
          <div className="chat-avatar mr-3" >
            <div className="chat-avatar-mode">
              <img id="user-avatar-button" src="https://via.placeholder.com/150x150"
                className="rounded-circle size-50"
                alt="" />
              {/* <span className="chat-mode online" /> */}
            </div>
          </div>
          <div className="module-user-info d-flex flex-column justify-content-center">
            <div className="module-title">
              <h1 className="mb-0 f text-primary font-weight-bold">{<IntlMessages id="chat.chatUser" />}</h1>
            </div>
          </div>
        </div>
        <div className="search-wrapper">
          <SearchBox placeholder="Search conversation"
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.props.searchChatUser} />
        </div>
      </div>

      <div className="chat-sidenav-content">

        <CustomScrollbars className="chat-sidenav-scroll scrollbar"
          style={{ height: this.props.width >= 1200 ? 'calc(100vh - 250px)' : 'calc(100vh - 202px)' }}
          onScroll={this.onScroll} onUpdate={this.handleUpdate.bind(this)}
        >
          {this.props.chatUsers.length === 0 ?
            <div className="p-5 no-user">{this.props.userNotFound}</div>
            :
            <ChatUserList chatUsers={this.props.chatUsers}
              selectedSectionId={this.props.selectedSectionId}
              onSelectUser={this.onSelectUser.bind(this)}
              handleOption={this.handleOption.bind(this)} />
          }
          {this.props.userLoader &&
            <div className="loader-view w-100" style={{ height: '50px' }}>
              <CircularProgress size={30} />
            </div>
          }
        </CustomScrollbars>
      </div>

    </div>
  };
  handleChange = (event, value) => {
    this.setState({ selectedTabIndex: value });
  };

  handleOption = (conversation, option) => {
    if (option === 0) {
      Swal.fire({
        icon: 'question',
        title: `Delete Conversation?`,
        text: `Are you sure you want to remove this conversation? You won't be able to undo it`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove it'
      }).then((result) => {
        if (result.value) {
          this.props.removeChatUser(conversation.id)
        }
      })
    }
  }

  handleUpdate(values) {
    const { pageNumber, authUser, end } = this.props
    const { shopId } = authUser
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 0.5;
    // t will be greater than 1 if we are about to reach the bottom
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && !end && t !== Infinity) {
      // this.props.fetchMoreChatUser({ shopId, pageNumber })
    }
  }


  handleChangeIndex = index => {
    this.setState({ selectedTabIndex: index });
  };
  showCommunication = () => {
    return (
      <div className="chat-box">
        <div className="chat-box-main">{
          this.props.selectedUser === null ?
            <div className="loader-view">
              <i className="zmdi zmdi-comment s-128 text-muted" />
              <h1 className="text-muted"> {<IntlMessages id="chat.selectUserChat" />}</h1>
              <Button className="d-block d-xl-none" color="primary"
                onClick={this.onChatToggleDrawer.bind(this)}>{<IntlMessages
                  id="chat.selectContactChat" />}</Button>
            </div>
            : this.Communication()}
        </div>
      </div>)
  };

  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0,
    }
  }

  componentDidMount() {
    const { authUser, chatUsers, pageNumber } = this.props
    const { shopId } = authUser
    this.props.fetchChatUser({ shopId, pageNumber: 1 });
    // this.props.fetchChatUserConversation()
  }

  updateSearchChatUser(evt) {
    this.props.updateSearchChatUser(evt.target.value);
    this.props.filterUsers(evt.target.value);
  }

  onChatToggleDrawer() {
    this.props.onChatToggleDrawer();
  }
  showAlert(type) {
    if (type === 'deleted') {
      Swal.fire({
        icon: 'success',
        title: `Delete Conversation Success`,
      })
      this.props.setState({ deleteSuccess: false })
    }
  }

  render() {
    const { loader, userState, drawerState, match, chatUsers } = this.props;
    const conversationId = match.params ? match.params.id : null
    if (drawerState) {
      const user = chatUsers.find(user => user.id == conversationId)
      if (user) {
        this.onSelectUser(user)
      }
    }
    return (
      <div className="app-wrapper app-wrapper-module">
        {this.props.deleteSuccess && this.showAlert('deleted')}
        <div className="app-module chat-module animated slideInUpTiny animation-duration-3">
          <div className="chat-module-box">
            {/* <div className="d-block d-xl-none">
              <Drawer open={drawerState}
                onClose={this.onChatToggleDrawer.bind(this)}>
                {this.ChatUsers()}
              </Drawer>
            </div> */}
            <div className="chat-sidenav d-none d-xl-flex">
              {this.ChatUsers()}
            </div>
            {loader ?
              <div className="loader-view w-100"
                style={{ height: 'calc(100vh - 120px)' }}>
                <CircularProgress />
              </div> : this.showCommunication()
            }
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ chatData, settings, auth }) => {
  const { authUser } = auth
  const { width } = settings;
  const {
    loader,
    userNotFound,
    drawerState,
    selectedSectionId,
    userState,
    searchChatUser,
    contactList,
    selectedUser,
    pageNumber,
    message,
    chatUsers,
    end,
    deleteSuccess,
    userLoader,
    conversationList,
    conversation
  } = chatData;
  return {
    width,
    pageNumber,
    loader,
    authUser,
    userNotFound,
    userLoader,
    drawerState,
    selectedSectionId,
    userState,
    end,
    searchChatUser,
    contactList,
    selectedUser,
    message,
    chatUsers,
    deleteSuccess,
    conversationList,
    conversation
  }
};

export default connect(mapStateToProps, {
  fetchChatUser,
  fetchChatUserConversation,
  filterUsers,
  onSelectUser,
  hideLoader,
  userInfoState,
  submitComment,
  removeChatUser,
  updateMessageValue,
  setState,
  updateSearchChatUser,
  fetchMoreChatUser,
  onChatToggleDrawer
})(ChatPanelWithRedux);