import React, { Component } from 'react'
import ItemService from './item-service'
import './Opportunity.css'

class Application extends Component {

    render() {

        return (
            <div className="application">
                <h1>{this.props.opportunity.title}</h1>
                <p>{this.props.opportunity.description}</p>
                <p>Closes {this.props.opportunity.date}</p>
                <p><a href={this.props.opportunity.url}>Read more...</a></p>
            </div>
        )
    }
}

export default Application
