import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import './Shortlist.css'

class Shortlist extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this)
        this.state = {
            items: [],
            shortlist: [],
            selectedItem: {},
            showDetails: false,
            urls: [{title:"", url:""}]
        }
    }

    async componentDidMount() {
        /*this.getItems().then(opps => {
            console.log("cdm near done boi " + opps)
            this.setState({ opportunities: opps });
            console.log("cdm done boi " + this.state.opportunities)
        });*/

        this.getItems();
    }

    render() {

        const items = this.state.items;
        if (!items) return null;
        const listItems = items.map((item) =>
            <Opportunity opportunity={item} onClick={this.urlClick} />
        );
        console.log(this.state.shortlist);

        if (this.state.showDetails == false) {
            return (
                <div className="shortlist">
    
                    {listItems}
    
                    {/*@TODO pagination*/}
    
                </div>
            )
        } else {
            const opp = this.state.selectedItem;

            return (
                <div className="shortlist">
                    <div className="detail">
                        <button type="button" onClick={this.backToOpportunities}>Back</button>
                        <h1>{opp.title}</h1>
                        <p>{opp.description}</p>
                        <p>{opp.fundingDescription}</p>
                        <p>{opp.fullEcon ? "✔ Full economic costing" : "✗ Full economic costing"}</p>
                        <p>{JSON.parse(opp.dates).map((date) =>
                            <span>{date.title}: {date.date}<br /></span>
                        )}</p>
                        <p>Tags: {opp.tags.join(', ')}</p>
                        
                        <hr />
                        <br />

                        <label>
                        Links:
                            {this.state.urls.map((urlObj, index) => 
                                <div className="links">
                                <input type="text" title="title" placeholder="Resource name" value={urlObj.title} onChange={(e) => this.handleUrlsChange(index, e)} />
                                <input type="text" title="url" placeholder="URL" value={urlObj.url} onChange={(e) => this.handleUrlsChange(index, e)} /> 
                                </div>                               
                            )}
                        <button id="add" onClick={this.addUrl} type="button">Add another URL</button>

                        </label>
                        <br />
                        <button id="submit" type="button">Submit changes</button>

                    </div>
                </div>
            )
        }

    }

    async getItem(itemLink) {
        console.log(itemLink);
        this.itemService.getItem(itemLink).then(item => {
            return item;
        }
        );
    }

    async getItems() {
        this.itemService.retrieveShortlist(this.props.user._links.shortlist.href).then(shortlists => {
            console.log(JSON.stringify(shortlists));
            this.setState({ shortlist:shortlists })
            Promise.all(shortlists.map(item => {
                return this.itemService.getItem(item._links.opportunity.href);
            })).then(opps => {
                this.setState({ items:opps })
            })
        }
        );
    }

    urlClick(item) {
        const shortlistItem = this.getShortlistItem(item);
        const urlsArr = JSON.parse(shortlistItem.urls);

        if (urlsArr.length > 0) {
            this.setState({
                urls : JSON.parse(shortlistItem.urls)
            })
        }
 
        this.setState({
            showDetails: true,
            selectedItem: item,
        });
    }

    getShortlistItem = (opp) => {
        var index = this.state.items.indexOf(opp);
        return this.state.shortlist[index];
    }

    backToOpportunities = async (e) => {
        e.preventDefault();
        this.setState({
            showDetails: false,
            urls: [{title:"", url:""}]
        });
    }

    handleUrlsChange = (index, e) => {
        e.preventDefault();

        let name = e.target.title;
        let value = e.target.value;
        var dummyUrls = this.state.urls;

        switch (name) {
            case "title":
                dummyUrls[index].title = value;
                break;
            case "url":
                dummyUrls[index].url = value;
                break;
        }

        this.setState({urls:dummyUrls});

    }

    addUrl = () => {
        var dummyUrls = this.state.urls;
        dummyUrls.push({title:"", url:""});
        this.setState({urls:dummyUrls});
    }

}

export default Shortlist
