import React, { Component } from 'react'
import ItemService from './item-service'
import './Opportunity.css'

class Opportunity extends Component {

    render() {
        //console.log("props: " + JSON.stringify(this.props));
        const title = this.props.opportunity.title;
        const description = this.props.opportunity.description;
        const fundingDesc = this.props.opportunity.fundingDescription;
        const fullEcon = this.props.opportunity.fullEcon;
        const dates = this.props.opportunity.dates;
        const url = this.props.opportunity.url;
        const tags = this.props.opportunity.tags;
        const tagsStr = tags.join(', ');
        const fullEconText = fullEcon ? "✔ Full economic costing" : "✗ Full economic costing";

        return (
            <div className="opportunity">
                <h1>{title}</h1>
                <p>{description}</p>
                <p>{fundingDesc}</p>
                <p>{fullEconText}</p>
                <p>Tags: {tagsStr}</p>
                <p className="link"><a href={url} onClick={() => this.props.onClick(this.props.opportunity)}>Read more...</a></p>
                {/*<p><a href={url} onClick={() => this.props.onClick(title, url, dates, description, fundingDesc, fullEcon, tags)}>Read more...</a></p>*/}
            </div>
        )
    }
}

export default Opportunity
