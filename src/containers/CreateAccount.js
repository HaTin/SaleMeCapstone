import React from 'react';
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  hideMessage,
  showAuthLoader,
  userSignUp,
} from 'actions/Auth';

class CreateAccount extends React.Component {
  constructor() {
    super();
    this.state = {
      shop: this.getShopURL(),
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirm: ''
    }
  }
  componentDidMount() {

  }

  getShopURL() {
    const urlString = window.location.href
    const url = new URL(urlString);
    const shop = url.searchParams.get('shop');
    return shop
  }

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser) {
      this.props.history.push('/');
    }
  }

  render() {
    const {
      email,
      shop,
      firstName,
      lastName,
      password,
      passwordConfirm
    } = this.state;
    const { showMessage, loader, alertMessage } = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">

          <div className="app-logo-content d-flex flex-column align-items-center justify-content-center">
            <h2 className="text-white font-weight-bold">Kết nối với SaleMe</h2>
            <img src={require("assets/images/shopify-logo.png")} width="200" alt="jambo" title="jambo" />
          </div>

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1><strong>Tạo tài khoản</strong></h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <TextField
                    label='Cửa hàng'
                    fullWidth
                    onChange={(event) => this.setState({ shop: event.target.value })}
                    defaultValue={shop}
                    disabled={true}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    label='Họ'
                    fullWidth
                    onChange={(event) => this.setState({ firstName: event.target.value })}
                    defaultValue={firstName}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    label='Tên'
                    fullWidth
                    onChange={(event) => this.setState({ lastName: event.target.value })}
                    defaultValue={lastName}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    label={<IntlMessages id="Email" />}
                    type='email'
                    fullWidth
                    onChange={(event) => this.setState({ email: event.target.value })}
                    defaultValue={email}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    type='password'
                    label='Mật khẩu'
                    fullWidth
                    onChange={(event) => this.setState({ password: event.target.value })}
                    defaultValue={password}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />
                  <TextField
                    type='password'
                    label='Xác nhận mật khẩu'
                    fullWidth
                    onChange={(event) => this.setState({ passwordConfirm: event.target.value })}
                    defaultValue={passwordConfirm}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />


                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button onClick={() => {
                      // this.props.showAuthLoader();
                      this.props.userSignUp({ email, firstName, lastName, shop, password });
                    }} variant="contained" color="primary">
                      Tạo tài khoản
                    </Button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>

        </div>
        {
          loader &&
          <div className="loader-view">
            <CircularProgress />
          </div>
        }
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  console.log(auth)
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser }
};

export default connect(mapStateToProps, {
  userSignUp,
  hideMessage,
  showAuthLoader
})(CreateAccount);
