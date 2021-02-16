import React, { Component } from 'react'
import ItemService from './item-service'
import './Opportunity.css'

class Opportunity extends Component {

    render() {
        console.log("props: " + JSON.stringify(this.props));
        const title = this.props.opportunity.title;
        const description = this.props.opportunity.description;
        const date = this.props.opportunity.date;
        const url = this.props.opportunity.url;
        const tags = this.props.opportunity.tags;
        const tagsStr = tags.join();
        
        return (
            <div className="opportunity">
                <h1>{title}</h1>
                <p>{description}</p>
                <p>Closes {date}</p>
                <p>Tags: {tagsStr}</p>
                <p><a href={url} onClick={() => this.props.onClick(title, url, date, description, tags)}>Read more...</a></p>
            </div>
        )
    }
}

export default Opportunity
