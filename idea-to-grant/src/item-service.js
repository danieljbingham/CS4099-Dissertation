// following tutorial at https://dzone.com/articles/consuming-rest-api-with-reactjs

import Configuration from './configuration';

class ItemService {

  constructor() {
    this.config = new Configuration();
  }

  async retrieveUsers() {
    let response = await fetch(this.config.USERS_COLLECTION_URL);
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
    let response = await fetch(this.config.OPPORTUNITIES_COLLECTION_URL + "?size=5&page=" + i);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      console.log(response);
      let json = await response.json();
      return json._embedded.opportunities;
    }
  }

  async retrieveOpportunitiesPages() {
    let response = await fetch(this.config.OPPORTUNITIES_COLLECTION_URL + "?size=5");
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
    let response = await fetch(url);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.tagPresets;
    }
  }

  async retrieveTaggedOpportunities(tags) {
    var tagsStr = tags.join(',');
    let response = await fetch(this.config.TAGGED_SEARCH_URL + "?tags=" + tagsStr);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.opportunities;
    }
  }

  async retrieveApplications() {
    let response = await fetch(this.config.APPLICATIONS_COLLECTION_URL);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.applications;
    }
  }

  async retrieveShortlist(link) {
    //let response = await fetch(this.config.SHORTLIST_COLLECTION_URL + "?user=" + link + "&size=5" + "&page=" + i);
    let response = await fetch(this.config.SHORTLIST_COLLECTION_URL + "?user=" + link);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      console.log(response);
      console.log(json);
      return json._embedded.shortlists;
    }
  }

  async retrieveShortlistPages(link) {
    let response = await fetch(this.config.SHORTLIST_COLLECTION_URL + "?user=" + link + "&size=5");
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
    let response = await fetch(this.config.TAGS_COLLECTION_URL);
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
    return fetch(itemLink)
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
    let response = await fetch(this.config.OPPORTUNITIES_COLLECTION_URL_POST, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
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
    let response = await fetch(this.config.USERS_COLLECTION_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
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
    let response = await fetch(this.config.TAGPRESET_COLLECTION_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newitem)
    });
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json;
    }
  }

  async deleteItem(itemlink) {
    console.log("ItemService.deleteItem():");
    console.log("item: " + itemlink);
    return fetch(itemlink, {
      method: "DELETE",
      mode: "cors"
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  async updateItem(item) {
    console.log("ItemService.updateItem():");
    console.log(item);
    return fetch(item.link, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    })
      .then(response => {
        if (!response.ok) {
          this.handleResponseError(response);
        }
        return response.json();
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  async createShortlistItem(newitem) {
    console.log(JSON.stringify(newitem));
    let response = await fetch(this.config.SHORTLIST_COLLECTION_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
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
    console.log(this.config.USER_SEARCH_URL + "?email=" + email);
    let response = await fetch(this.config.USER_SEARCH_URL + "?email=" + email);
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