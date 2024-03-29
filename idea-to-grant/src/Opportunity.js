import React, { Component } from 'react'
import './Opportunity.css'

class Opportunity extends Component {

    // render Opportunity component based on props
    render() {
        const title = this.props.opportunity.title;
        const description = this.truncate(this.props.opportunity.description);
        const fundingDesc = this.truncate(this.props.opportunity.fundingDescription);
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
            </div>
        )
    }

    // truncate a string to only show 180 characters
    truncate(s) {
        if (s.length < 180) {
            return s;
        } else {
            return s.substring(0, 180).trim() + "...";
        }
    }
}

export default Opportunity
