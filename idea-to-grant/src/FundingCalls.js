import React, { Component } from 'react'
import ItemService from './item-service'

class FundingCalls extends Component {
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
            <div className="fundingCalls">
                <h1>Funding Calls</h1>
                


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

export default FundingCalls
