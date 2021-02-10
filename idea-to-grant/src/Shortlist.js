import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';

class Shortlist extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            showDetails: false,
        }
    }

    async componentDidMount() {
        /*this.getItems().then(opps => {
            console.log("cdm near done boi " + opps)
            this.setState({ opportunities: opps });
            console.log("cdm done boi " + this.state.opportunities)
        });*/

        let items = await this.getItems();
        //console.log("cdm done boi " + JSON.stringify(opps))
        let opps = items.map(opp => <Opportunity opportunity={opp} />);
        this.setState({ opportunities: opps });

    }

    render() {
        console.log("render!")
        console.log(this.state.opportunities)
        return (
            <div className="shortlist">

                {this.state.opportunities}

                {/*@TODO pagination*/}

            </div>
        )
    }

    async getItem(itemLink) {
        console.log(itemLink);
        this.itemService.getItem(itemLink).then(item => {
            return item;
        }
        );
    }

    async getItems() {
        /*this.itemService.retrieveApplications().then(async items => {
            console.log("retrieved :)")
            let listItems = await Promise.all(
                items.map(async item => {
                    let itemResponse = await this.itemService.getItem(item._links.opportunity.href);
                    console.log("item response " + itemResponse)
                    return itemResponse;
                })
            );
            console.log("returning " + JSON.stringify(listItems));
            return listItems;
        }
        );*/

        //let items = await this.itemService.retrieveApplications();
        let items = await this.itemService.retrieveShortlist();
        console.log("retrieved :)")
        let listItems = await Promise.all(
            items.map(async item => {
                let itemResponse = await this.itemService.getItem(item._links.opportunity.href);
                console.log("item response " + itemResponse)
                return itemResponse;
            })
        );
        console.log("returning " + JSON.stringify(listItems));
        return listItems;
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

export default Shortlist
