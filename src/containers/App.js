import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl'
import "assets/vendors/style"
import defaultTheme from './themes/defaultTheme';
import AppLocale from '../lngProvider';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import MainApp from 'app/index';
import { setInitUrl } from '../actions/Auth';
import asyncComponent from 'util/asyncComponent';

const RestrictedRoute = ({ component: Component, authUser, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />}
  />;
class App extends Component {

  componentWillMount() {
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
    if (this.props.initURL === '') {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
  }

  render() {
    const { match, location, authUser, locale, initURL } = this.props;
    if (location.pathname === '/') {
      if (!authUser) {
        return (<Redirect to={'/signin'} />);
      } else if (initURL === '' || initURL === '/' || initURL === '/signin' || initURL === '/signup') {
        return (<Redirect to={'/app/bot-config'} />);
      } else {
        return (<Redirect to={initURL} />);
      }
    }
    const applyTheme = createMuiTheme(defaultTheme);


    const currentAppLocale = AppLocale[locale.locale];
    return (
      <MuiThemeProvider theme={applyTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}>
            <div className="app-main">
              <Switch>
                <RestrictedRoute path={`${match.url}app`} authUser={authUser}
                  component={MainApp} />
                <Route path='/signin' component={SignIn} />
                <Route path='/signup' component={CreateAccount} />
                <Route
                  component={asyncComponent(() => import('components/Error404'))} />
              </Switch>
            </div>
          </IntlProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { sideNavColor, locale, isDirectionRTL } = settings;
  const { authUser, initURL } = auth;
  return { sideNavColor, locale, isDirectionRTL, authUser, initURL }
};

export default connect(mapStateToProps, { setInitUrl })(App);

