import React, { Component } from 'react'
import Main from './Main'
import './App.css';
import Authorize from './authorize'
import ItemService from './item-service'

class App extends Component {
  constructor(props) {
    super(props);
    this.authorize = new Authorize();
    this.itemService = new ItemService();
    this.onClick = this.onClick.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.notifyUser = this.notifyUser.bind(this);
    this.logError = this.logError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      status: "login",
      user: {},
      role: "researcher",
      accessToken: ""
    }
  }

  render() {

    let renderLoginOrMain;

    // render depends on wheteher user needs to login, register, or they are already logged in

    if (this.state.status === "login") {

      renderLoginOrMain = <button id="google" type="submit" name="google" onClick={this.onClick}>
      </button>

    } else if (this.state.status === "register") {

      renderLoginOrMain =
        <div id="register">
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.user.name} title="name" readonly />
            </label>
            <label>
              Email:
              <input type="text" value={this.state.user.email} title="email" readonly />
            </label>
            <label>
              Role:
              <select id="roles" name="roles" value={this.state.role} onChange={this.handleRoleChange}>
                <option value="researcher">Researcher</option>
                <option value="bdm">Business Development Manager</option>
              </select>
            </label>

            <input type="submit" value="Register account" />
          </form>
        </div>;

    } else {

      // logged in, render app
      renderLoginOrMain = <Main user={this.state.user} accessToken={this.state.accessToken} />;

    }

    return (
      <div className="app">
        {renderLoginOrMain}
      </div>
    );

  }

  // onChange function for role dropdown when registering
  handleRoleChange = (e) => {
    this.setState({ role: e.target.value });
  }

  // onClick function for Google Login button
  onClick() {
    this.authorize.getAccessToken()
      .then(this.getUserInfo)
      .then(this.notifyUser)
      .catch(this.logError);
  }

  // code based on Mozilla's Google OAuth tutorial: https://github.com/mdn/webextensions-examples/tree/master/google-userinfo
  // gets user object from Google login
  getUserInfo(accessToken) {
    const requestURL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";
    const requestHeaders = new Headers();
    this.setState({ accessToken: accessToken });
    this.itemService = new ItemService(accessToken);
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

  // code based on Mozilla's Google OAuth tutorial: https://github.com/mdn/webextensions-examples/tree/master/google-userinfo
  // check if user exists in the backend after getting user object from Google
  async notifyUser(authUser) {
    let newUser = await this.itemService.checkUserExists(authUser.email);
    if (newUser == null) {
      this.setState({ status: "register", user: authUser });
    } else {
      this.setState({ status: "done", user: newUser });
    }
  }

  // onSubmit function for user registration, creating user in system
  handleSubmit = async (e) => {
    e.preventDefault();
    let requestBody = {
      "name": this.state.user.name,
      "email": this.state.user.email,
      "role": this.state.role
    };
    let response = await this.itemService.createUser(requestBody);

    this.setState({ user: response, status: "done" });
  }

  logError(error) {
    console.error(error);
  }

}


export default App;
