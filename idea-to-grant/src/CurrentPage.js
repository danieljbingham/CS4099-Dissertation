import React, { Component } from 'react'
import './CurrentPage.css'
import ItemService from './item-service'

class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            showDetails: false,
        }
    }

    componentDidMount() {
        this.getItems();
    }

    render() {
        const items = this.state.items;
        if (!items) return null;
        const listItems = items.map((item) =>
            <li key={item.id} onClick={() => this.onSelect(item.id)}>
                <span className="item-name">{item.name}</span>&nbsp;|&nbsp; {item.role}
            </li>
        );

        return (
            <div className="currentPage">
                <h1>Research Opportunity | research.com</h1>
                <textarea>Make some notes about this project here...</textarea>

                <h1>Information about research agency</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam ac suscipit mattis. Quisque nec placerat quam.
                Aenean efficitur metus vitae lacus aliquet, at consequat erat pulvinar.
                Integer non arcu sit amet nisl egestas mollis...</p>

                <h1>Resources</h1>
                <select name="Cars" size="3">
                    <option value="file1.pdf"> file1.pdf </option>
                    <option value="file2.doc"> file2.doc </option>
                    <option value="file3.jpeg"> file3.jpeg </option>
                </select>
                <button type="button">Upload files for this opportunity</button>

                <h1>Time until application deadline</h1>
                <progress id="deadline" value="32" max="100" />

                {/*<div className="currentPage__addToShortlist">
                <input type="checkbox" id="chkShortlist" name="shortlist" value="add" />
                <label for="chkShortlist"> Add this opportunity to shortlist</label>
            </div>*/}

                <button type="button">Add this opportunity to my shortlist</button>

                <ul>
                    {listItems}
                </ul>


            </div>
        )
    }

    getItems() {
        this.itemService.retrieveItems().then(items => {
              this.setState({items: items});
            }
        );
    }

    onSelect(itemLink) {
        this.clearState();
        this.itemService.getItem(itemLink).then(item => {
          this.setState({
              showDetails: true,
              selectedItem: item
            });
          }
        );
      }
}

export default CurrentPage
