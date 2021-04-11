// following tutorial at https://dzone.com/articles/consuming-rest-api-with-reactjs

import * as config from './configuration';

class ItemService {

  constructor(accessToken) {
    this.accessToken = accessToken;
    console.log(this.accessToken);
    console.log(accessToken);
  }

  async retrieveUsers() {
    let response = await fetch(config.USERS_COLLECTION_URL, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();

      const items = [];
      const itemArray = json._embedded.userList;
      for (var i = 0; i < itemArray.length; i++) {
        itemArray[i]["link"] = itemArray[i]._links.self.href;
        items.push(itemArray[i]);
      }
      return items;
    }
  }

  async retrieveOpportunities(i) {
    let response = await fetch(config.OPPORTUNITIES_COLLECTION_URL + "?size=5&page=" + i, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      console.log(response);
      let json = await response.json();
      return json._embedded.opportunities;
    }
  }

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
      console.log(response);
      console.log(json.page.totalPages);
      return json.page.totalPages;
    }
  }

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
      console.log(response);
      console.log(json);
      return json._embedded.shortlist;
    }
  }

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
      console.log(response);
      console.log(json);
      console.log(json.page.totalPages);
      return json.page.totalPages;
    }
  }

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

  async getItem(itemLink) {
    console.log("ItemService.getItem():");
    console.log("Item: " + itemLink);
    return fetch(itemLink, {
      headers: new Headers({
        'Authorization': 'Bearer ' + this.accessToken
      })
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .then(item => {
        console.log("return item " + JSON.stringify(item));
        return item;
      }
      )
      .catch(error => {
        this.handleError(error);
      });
  }

  async createItem(newitem) {
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

  async createShortlistItem(newitem) {
    console.log(JSON.stringify(newitem));
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
      console.log(JSON.stringify(json));
      return json;
    }
  }

  async editShortlistItem(newitem, url) {
    console.log(JSON.stringify(newitem));
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
      console.log(JSON.stringify(json));
      return json;
    }
  }

  async removeOpportunity(url) {
    let body = {publicOpportunity: false}
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
      console.log(JSON.stringify(json));
      return json;
    }
  }

  async checkUserExists(email) {
    console.log(config.USER_SEARCH_URL + "?email=" + email);
    console.log('Bearer ' + this.accessToken);
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

  handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
  }

  handleError(error) {
    console.log(error.message);
  }

}

export default ItemService;