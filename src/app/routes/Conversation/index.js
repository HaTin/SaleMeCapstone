import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton'
import ChatUserList from 'components/chatPanel/ChatUserList/index';
import Conversation from 'components/chatPanel/Conversation/index';
import SearchBar from 'material-ui-search-bar'
import SearchBox from 'components/SearchBox';
import IntlMessages from 'util/IntlMessages';
import Swal from 'sweetalert2'
import {
  fetchChatUser,
  fetchChatUserConversation,
  fetchMoreChatUser,
  searchMessage,
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


  onSelectUser = (user) => {
    const { selectedUser } = this.props
    if (!selectedUser || user.id !== selectedUser.id) {
      this.props.onSelectUser(user);
    }
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
    const { message, selectedUser, conversation, scrollComponent } = this.props;
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
              <img src="https://icon-library.net/images/default-user-icon/default-user-icon-8.jpg"
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

      <CustomScrollbars ref={this.scrollComponent} className="chat-list-scroll scrollbar">
        <Conversation conversationData={JSON.parse(JSON.stringify(conversation))}
          selectedUser={selectedUser} />
      </CustomScrollbars>
    </div>
  };

  ChatUsers = () => {
    return <div className="chat-sidenav-main">
      <div className="chat-sidenav-header">
        <div className="chat-user-hd">
          <div className="chat-avatar mr-3" >
            <div className="chat-avatar-mode">
              <img id="user-avatar-button" src="https://img.icons8.com/carbon-copy/2x/bot.png"
                className="rounded-circle size-50"
                alt="" />
              {/* <span className="chat-mode online" /> */}
            </div>
          </div>
          <div className="module-user-info d-flex flex-column justify-content-center">
            <div className="module-title">
              <h1 className="mb-0 f text-primary font-weight-bold">Trò chuyện</h1>
            </div>
          </div>
        </div>
        <div className="search-wrapper">
          <SearchBar
            onChange={this.updateSearchChatUser.bind(this)}
            hintText="Tìm cuộc trò chuyện"
            onCancelSearch={this.updateSearchChatUser.bind(this, '')}
            style={{
              margin: '0 auto',
              maxWidth: 800
            }}
            placeholder="Tìm cuộc trò chuyện"
            value={this.props.searchChatUser}
          />
          {/*           
          <SearchBox placeholder="Tìm cuộc trò chuyện"
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.state.search} /> */}
        </div>
      </div>

      <div className="chat-sidenav-content">

        <CustomScrollbars className="chat-sidenav-scroll scrollbar"
          style={{ height: this.props.width >= 1200 ? 'calc(100vh - 250px)' : 'calc(100vh - 202px)' }}
          onScroll={this.onScroll} onUpdate={this.handleUpdate.bind(this)}
        >
          {this.props.chatUsers.length === 0 || (this.props.isSearching && !this.props.searchResults.length) ?
            <div className="p-5 no-user">{this.props.userNotFound}</div>
            :
            <ChatUserList
              chatUsers={!this.props.isSearching ? this.props.chatUsers : this.props.searchResults}
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
        title: `Xóa cuộc trò chuyện?`,
        text: `Bạn có chắc muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác`,
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
      }).then((result) => {
        if (result.value) {
          this.props.setState({ deleteUserId: conversation.id })
          this.props.removeChatUser(conversation.id)
        }
      })
    }
  }

  handleUpdate(values) {
    const { pageNumber, authUser, end, isSearching } = this.props
    const { shopId } = authUser
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 0.5;
    // t will be greater than 1 if we are about to reach the bottom
    const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
    if (t > 1 && !end && t !== Infinity && !isSearching) {
      this.props.fetchMoreChatUser({ shopId, pageNumber })
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
    this.scrollComponent = React.createRef();
    this.state = {
      selectedTabIndex: 0,
      search: '',
      timeout: 0
    }
  }
  componentDidUpdate(prevProps) {
    const scrollBar = this.scrollComponent.current
    if (this.props.scrollDown && scrollBar) {
      setTimeout(() => {
        scrollBar.scrollToBottom()
      }, 200)
      this.props.setState({ scrollDown: false })
    }
    if (this.props.deleteSuccess) {
      this.showAlert('deleted')
    }
    if (this.props.showMessage) {
      this.showErrorMessage()
      this.props.setState({ alertMessage: '', showMessage: false })
    }
  }

  componentDidMount() {
    const { authUser, chatUsers, pageNumber } = this.props
    const { shopId } = authUser
    this.props.fetchChatUser({ shopId, pageNumber: 1 });
    // setInterval(() => {
    //   this.props.fetchChatUser({ shopId, pageNumber: 1 });
    // }, 3000)
    // this.props.fetchChatUserConversation()
  }

  updateSearchChatUser(search) {
    // const search = evt.target.value
    const shopId = this.props.authUser.shopId
    // this.setState((state) => ({
    //   search
    // }));
    this.props.setState({
      searchChatUser: search,
    })
    if (this.state.timeout) clearTimeout(this.state.timeout)
    this.state.timeout = setTimeout(() => {
      this.props.searchMessage({ search, shopId });
    }, 800)
    // this.props.filterUsers(evt.target.value);
  }

  onChatToggleDrawer() {
    this.props.onChatToggleDrawer();
  }
  showAlert(type) {
    if (type === 'deleted') {
      Swal.fire({
        icon: 'success',
        title: `Xóa thành công`,
      })
      this.props.setState({ deleteSuccess: false })
      if (this.props.isSearching) {
        this.props.searchMessage({ search: this.props.searchChatUser, shopId: this.props.authUser.shopId })
      }
      if (this.props.selectedUser && this.props.deleteUserId === this.props.selectedUser.id) {
        this.props.setState({
          selectedSectionId: null,
          selectedUser: null
        })
      }
    }
  }
  showErrorMessage() {
    Swal.fire({
      icon: 'error',
      title: this.props.alertMessage
    })
  }

  render() {
    const { loader, userState, drawerState, match, chatUsers, showMessage, history } = this.props;
    const conversationId = match.params ? match.params.id : null
    if (drawerState && conversationId) {
      const user = chatUsers.find(user => user.id == conversationId)
      if (user) {
        this.onSelectUser(user)
      } else {
        history.push('/app/error')
      }
    }
    return (
      <div className="app-wrapper app-wrapper-module">

        <div className="app-module chat-module animated slideInUpTiny animation-duration-3">
          <div className="chat-module-box">
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
    deleteUserId,
    selectedUser,
    pageNumber,
    alertMessage,
    message,
    chatUsers,
    end,
    searchResults,
    isSearching,
    deleteSuccess,
    scrollDown,
    userLoader,
    showMessage,
    conversationList,
    conversation
  } = chatData;
  return {
    width,
    pageNumber,
    loader,
    authUser,
    deleteUserId,
    userNotFound,
    alertMessage,
    userLoader,
    showMessage,
    drawerState,
    selectedSectionId,
    userState,
    end,
    searchChatUser,
    contactList,
    scrollDown,
    selectedUser,
    message,
    chatUsers,
    deleteSuccess,
    conversationList,
    searchResults,
    isSearching,
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
  searchMessage,
  updateSearchChatUser,
  fetchMoreChatUser,
  onChatToggleDrawer
})(ChatPanelWithRedux);