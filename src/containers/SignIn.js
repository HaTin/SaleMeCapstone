import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import {
  hideMessage,
  showAuthLoader,
  userSignIn,
} from 'actions/Auth';

class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: 'tyntin091@gmail.com',
      password: '12345'
    }
  }

  componentDidUpdate() {
    // if (this.props.showMessage) {
    //   this.notiContainer.current.setState((prevState) => ({
    //     notifications: []
    //   }))
    //   console.log(this.refs.notiContainer)

    // }
    if (this.props.authUser) {
      this.props.hideMessage();
      this.props.history.push('/');
    }
  }
  // _handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     this.handleSubmit()
  //   }
  // };

  handleSubmit = () => {
    const { email, password } = this.state
    this.props.showAuthLoader();
    this.props.userSignIn({ email, password });
  }


  render() {
    const {
      email,
      password
    } = this.state;
    const { showMessage, loader, alertMessage } = this.props;
    return (
      <div
        className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">

          <div className="app-logo-content d-flex align-items-center justify-content-center">
            <span className="app-logo">SaleMe</span>
          </div>

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1 className="font-weight-bold">Đăng nhập</h1>
              <p className="error">{showMessage && alertMessage}</p>
            </div>

            <div className="app-login-form">
              <ValidatorForm ref="form" onSubmit={this.handleSubmit} onError={errors => console.log(errors)}>
                <TextValidator
                  label={<IntlMessages id="appModule.email" />}
                  fullWidth
                  onChange={(event) => this.setState({ email: event.target.value })}
                  value={email}
                  validators={['required', 'isEmail']}
                  errorMessages={['Vui lòng nhập email', 'Email không đúng định dạng']}
                  margin="normal"
                  className="mt-1 my-sm-3"
                />
                <TextValidator
                  type="password"
                  label={<IntlMessages id="appModule.password" />}
                  fullWidth
                  validators={['required']}
                  errorMessages={['Vui lòng nhập mật khẩu']}
                  onChange={(event) => this.setState({ password: event.target.value })}
                  value={password}
                  margin="normal"
                  className="mt-1 my-sm-3"
                />

                <div className="mb-3 d-flex align-items-center justify-content-between">
                  <Button type="submit" variant="contained" color="primary">
                    <IntlMessages id="appModule.signIn" />
                  </Button>
                </div>
              </ValidatorForm>
            </div>
          </div>

        </div>
        {
          loader &&
          <div className="loader-view">
            <CircularProgress />
          </div>
        }

        {/* <NotificationContainer ref={this.notiContainer} /> */}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser } = auth;
  return { loader, alertMessage, showMessage, authUser }
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader,
})(SignIn);
