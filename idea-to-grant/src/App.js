import React, { Component } from 'react'
import Main from './Main'
import './App.css';
import Authorize from './authorize'

class App extends Component {
  constructor(props) {
    super(props);
    this.authorize = new Authorize();
    this.onClick = this.onClick.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.notifyUser = this.notifyUser.bind(this);
    this.logError = this.logError.bind(this);
    this.state = {
      loggedIn: false
    }
  }

  render() {

    let renderLoginOrMain;

    if (this.state.loggedIn) {
      renderLoginOrMain = <Main />;
    } else {
      renderLoginOrMain = <button id="google" type="submit" name="google" onClick={this.onClick}>
      </button>

    }

    return (
      <div className="app">
        {renderLoginOrMain}
      </div>
    );

  }

  onClick() {
    this.authorize.getAccessToken()
      .then(this.getUserInfo)
      .then(this.notifyUser)
      .catch(this.logError);
  }

  getUserInfo(accessToken) {
    const requestURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
    const requestHeaders = new Headers();
    requestHeaders.append('Authorization', 'Bearer ' + accessToken);
    const driveRequest = new Request(requestURL, {
      method: "GET",
      headers: requestHeaders
    });

    return fetch(driveRequest).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response.status;
      }
    });
  }

  notifyUser(user) {
    console.log(user);
    this.setState({ loggedIn: true });
  }

  logError(error) {
    console.error(error);
  }

}


export default App;
