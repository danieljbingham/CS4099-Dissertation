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

  async retrieveOpportunities() {
    let response = await fetch(this.config.OPPORTUNITIES_COLLECTION_URL);
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

  //TODO shortlist from user
  async retrieveShortlist() {
    let response = await fetch(this.config.SHORTLIST_COLLECTION_URL);
    if (!response.ok) {
      this.handleResponseError(response);
    } else {
      let json = await response.json();
      return json._embedded.shortlists;
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
    let response = await fetch(this.config.OPPORTUNITIES_COLLECTION_URL, {
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


  handleResponseError(response) {
    throw new Error("HTTP error, status = " + response.status);
  }

  handleError(error) {
    console.log(error.message);
  }

}

export default ItemService;