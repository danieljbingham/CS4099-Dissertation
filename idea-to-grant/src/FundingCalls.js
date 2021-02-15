import React, { Component, useRef, useState } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import './FundingCalls.css'


class FundingCalls extends Component {

    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this);
        this.state = {
            showDetails: false,
            tagifyRef: React.createRef(),
            tagifyProps: {whitelist: ["html","css","js","java","c++","compsci","maths"]}
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

        console.log(this.state.tagifyRef);

        return (
            <div className="fundingCalls">

                <Tags
                    tagifyRef={this.state.tagifyRef} // optional Ref object for the Tagify instance itself, to get access to inner-methods
                    settings={{
                        dropdown:{
                            maxItems: 20,           // <- mixumum allowed rendered suggestions
                            enabled: 0,             // <- show suggestions on focus
                            closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                        },
                        placeholder:"type some tags..."
                    }}
                    {...this.state.tagifyProps}   // dynamic props such as "loading", "showDropdown:'abc'", "value"
                    onChange={e => (e.persist(), console.log("CHANGED:", e.target.value))}
                />


                {listItems}

                {/*@TODO pagination*/}

            </div>
        )
    }

    getItems() {
        this.itemService.retrieveOpportunities().then(items => {
            this.setState({ items: items });
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

    urlClick(title, url, date, description) {
        this.props.setTitle(title);
        this.props.setUrl(url);
        this.props.setDate(date);
        this.props.setDescription(description);
        this.props.changeTab(0);
    }
}

export default FundingCalls
