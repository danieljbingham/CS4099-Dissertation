import React, { Component } from 'react'
import ItemService from './item-service'
import './Opportunity.css'

class Opportunity extends Component {

    render() {
        console.log("props: " + JSON.stringify(this.props));
        return (
            <div className="opportunity">
                <h1>{this.props.opportunity.title}</h1>
                <p>{this.props.opportunity.description}</p>
                <p>Closes {this.props.opportunity.date}</p>
                <p><a href={this.props.opportunity.url} onClick={this.props.onClick}>Read more...</a></p>
            </div>
        )
    }
}

export default Opportunity
