import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';

class FundingCalls extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this);
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
            <Opportunity opportunity={item} onClick={this.urlClick} />
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

    urlClick() {
        this.props.changeTab(0);
    }
}

export default FundingCalls
