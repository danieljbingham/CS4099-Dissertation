    /*global browser*/

/* from firefox tutorial at https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity */

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = "334757634491-21u027vkjh6pvgofvm25oomhm2ch4i55.apps.googleusercontent.com";
const SCOPES = ["openid", "email", "profile"];
const AUTH_URL =
  `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;
const VALIDATION_BASE_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";

class Authorize {
  
  constructor() {
    this.extractAccessToken = this.extractAccessToken.bind(this);
    this.validate = this.validate.bind(this);
    this.authorize = this.authorize.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  extractAccessToken(redirectUri) {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1)
      return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
  }

  /**
  Validate the token contained in redirectURL.
  This follows essentially the process here:
  https://developers.google.com/identity/protocols/OAuth2UserAgent#tokeninfo-validation
  - make a GET request to the validation URL, including the access token
  - if the response is 200, and contains an "aud" property, and that property
  matches the clientID, then the response is valid
  - otherwise it is not valid
  
  Note that the Google page talks about an "audience" property, but in fact
  it seems to be "aud".
  */
  validate(redirectURL) {
    const accessToken = this.extractAccessToken(redirectURL);
    if (!accessToken) {
      throw "Authorization failure";
    }
    const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
    const validationRequest = new Request(validationURL, {
      method: "GET"
    });

    function checkResponse(response) {
      return new Promise((resolve, reject) => {
        if (response.status != 200) {
          reject("Token validation error");
        }
        response.json().then((json) => {
          if (json.aud && (json.aud === CLIENT_ID)) {
            resolve(accessToken);
          } else {
            reject("Token validation error");
          }
        });
      });
    }

    return fetch(validationRequest).then(checkResponse);
  }

  /**
  Authenticate and authorize using browser.identity.launchWebAuthFlow().
  If successful, this resolves with a redirectURL string that contains
  an access token.
  */
  authorize() {
    return browser.identity.launchWebAuthFlow({
      interactive: true,
      url: AUTH_URL
    });
  }

  getAccessToken() {
    return this.authorize().then(this.validate);
  }

}

export default Authorize;
