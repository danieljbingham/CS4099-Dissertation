// following tutorial at https://dzone.com/articles/consuming-rest-api-with-reactjs

import * as config from './configuration';

// item service makes API requests, authenticated using access token

class ItemService {

  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // get opportunities using pagination, ith page
  async retrieveOpportunities(i) {
    let response = await fetch(config.OPPORTUNITIES_COLLECTION_URL + "?size=5&page=" + i, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.opportunities;
    }
  }

  // get number of pages needed to display all opportunities
  async retrieveOpportunitiesPages() {
    let response = await fetch(config.OPPORTUNITIES_COLLECTION_URL + "?size=5", {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json.page.totalPages;
    }
  }

  // get saved searches for user
  async retrieveTagPresets(url) {
    let response = await fetch(url, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.tagPresets;
    }
  }

  // get opportunities which have the given tags
  async retrieveTaggedOpportunities(tags) {
    var tagsStr = tags.join(',');
    let response = await fetch(config.TAGGED_SEARCH_URL + "?tags=" + tagsStr, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.opportunities;
    }
  }

  // get shortlist for the given user
  async retrieveShortlist(link) {
    let response = await fetch(config.SHORTLIST_COLLECTION_URL + "?user=" + link, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.shortlist;
    }
  }

  // get number of pages needed to display shortlisted opportunities
  async retrieveShortlistPages(link) {
    let response = await fetch(config.SHORTLIST_COLLECTION_URL + "?user=" + link + "&size=5", {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json.page.totalPages;
    }
  }

  // get shortlisted opportunities which have the given status
  async retrieveShortlistByStatus(status, user, page) {
    var statusStr = status.join(',');
    let response = await fetch(config.SHORTLIST_STATUS_SEARCH_URL + "?status=" + status + "&user=" + user + "&page=" + page + "&size=5", {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.shortlist;
    }
  }

  // get all tags used in the system (needed for autocomplete)
  async retrieveTags() {
    let response = await fetch(config.TAGS_COLLECTION_URL, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.strings;
    }
  }

  // generic method used for getting any API resource at the given link
  async getItem(itemLink) {
    let response = await fetch(itemLink, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // posts new opportunity
  async createOpportunity(newitem) {
    let response = await fetch(config.OPPORTUNITIES_COLLECTION_URL_POST, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // posts new user
  async createUser(newitem) {
    let response = await fetch(config.USERS_COLLECTION_URL, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // posts new saved search
  async createTagPreset(newitem) {
    let response = await fetch(config.TAGPRESET_COLLECTION_URL, {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // posts new shortlisted item
  async createShortlistItem(newitem) {
    let response = await fetch(config.SHORTLIST_COLLECTION_URL_POST, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // updates shortlist item using patch
  // patch means only the changed attributes need to be sent in the API call
  async editShortlistItem(newitem, url) {
    let response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // remove opportunity
  // rather than deleting it, the public attribute is set to false
  // therefore, patch is used rather than delete
  async removeOpportunity(url) {
    let body = { publicOpportunity: false }
    let response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.accessToken
      }),
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // try to get user object if one exists
  async checkUserExists(email) {
    let response = await fetch(config.USER_SEARCH_URL + "?email=" + email, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (response.status === 404) {
      // no user for this email
      return null;
    } else if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  // generic method used for removing from shortlist
  async removeShortlist(link) {
    let response = await fetch(link, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    }
  }


  handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
  }

  handleError(error) {
    console.log(error.message);
  }

}

export default ItemService;