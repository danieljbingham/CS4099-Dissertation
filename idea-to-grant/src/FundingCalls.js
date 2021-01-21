import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';

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
            <Opportunity opportunity={item} />
        );

        return (
            <div className="fundingCalls">
                
                {listItems}

                {/*@TODO pagination*/}

            </div>
        )
    }

    getItems() {
        this.itemService.retrieveOpportunities().then(items => {
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
