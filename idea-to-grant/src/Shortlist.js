import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import ReactPaginate from 'react-paginate';
import './Shortlist.css'

class Shortlist extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this)
        this.state = {
            items: [],
            pages: 0,
            shortlist: [],
            filteredItems: [],
            filteredShortlist: [],
            selectedItem: {},
            showDetails: false,
            editing: false,
            urls: [{title:"", url:""}],
            status: "",
            filter: {
                all: true,
                shortlisted: true,
                applying: true,
                submitted: true,
                closed: true                
            }
        }
    }

    async componentDidMount() {
        /*this.getItems().then(opps => {
            console.log("cdm near done boi " + opps)
            this.setState({ opportunities: opps });
            console.log("cdm done boi " + this.state.opportunities)
        });*/

        this.getPages();
        this.getItems(0);
    }

    render() {

        const items = this.state.filteredItems;

        if (!items) return null;
        const listItems = items.map((item) =>
            <Opportunity opportunity={item} onClick={this.urlClick} />
        );

        if (this.state.showDetails == false) {
            return (
                <div className="shortlist">

                    <div className="filters">
                    <label>
                        Show all
                        <input type="checkbox" checked={this.state.filter.all} title="all" onChange={this.handleChange} />
                    </label>
                    <label>
                        Shortlisted
                        <input type="checkbox" checked={this.state.filter.shortlisted} title="shortlisted" onChange={this.handleChange} />
                    </label>
                    <label>
                        Applying
                        <input type="checkbox" checked={this.state.filter.applying} title="applying" onChange={this.handleChange} />
                    </label>
                    <label>
                        Submitted
                        <input type="checkbox" checked={this.state.filter.submitted} title="submitted" onChange={this.handleChange} />
                    </label>
                    <label>
                        Closed
                        <input type="checkbox" checked={this.state.filter.closed} title="closed" onChange={this.handleChange} />
                    </label>
                    </div>

                    {listItems}
    
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        breakClassName={'break'}
                        pageCount={this.state.pages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
    
                </div>
            )
        } else {
            const opp = this.state.selectedItem;

            var editing = null;
            if (this.state.editing) {
                editing = <div>
                <br />
                <label>
                Links:
                    {this.state.urls.map((urlObj, index) => 
                        <div className="linksEditing">
                        <input type="text" title="title" placeholder="Resource name" value={urlObj.title} onChange={(e) => this.handleUrlsChange(index, e)} />
                        <input type="text" title="url" placeholder="URL" value={urlObj.url} onChange={(e) => this.handleUrlsChange(index, e)} /> 
                        <button id="remove" title="Remove" onClick={(e) => this.removeUrl(index, e)}>-</button>
                        </div>                               
                    )}
                <button id="add" className="secondary-btn" onClick={this.addUrl} type="button">Add another URL</button>

                </label>
                <br />

                <label>
                Set status:
                <br />
                <select value={this.state.status} onChange={this.handleDropdownChange} required="required">
                {/*<option selected disabled hidden>Set status...</option>*/}
                <option value="shortlisted">Shortlisted opportunity</option>
                <option value="applying">Working on application</option>
                <option value="submitted">Application submitted</option>
                <option value="closed">Opportunity closed</option>
                </select>

                </label>
                <br />

                <button id="submit" type="button" onClick={this.submitChanges}>Submit changes</button>
                </div>
            } else {
                editing = <div>
                <br />
                <label>
                Links:
                    {console.log(this.state.urls.length)}
                    {this.state.urls.length > 1 || (this.state.urls[0].url != "" && this.state.urls[0].title != "") ?
                    this.state.urls.map((urlObj, index) => 
                        <a href={this.addhttp(urlObj.url)} className="links">
                        <p>{urlObj.title}</p>
                        </a>                               
                    ) : <span> none<br /></span>              
                    }
                </label>
                <br />

                <label>
                <p>Status: {this.state.status}</p>
                </label>

                <button id="edit" type="button" onClick={this.startEditing}>Edit</button>
                <a id="share" class="secondary-btn" onClick={(e) => window.open(this.mailtoLink())} target="_blank">Share by email</a>
                </div>
            }
                
            return (
                <div className="shortlist">
                    <div className="detail">
                        <button type="button" className="secondary-btn" onClick={this.backToOpportunities}>Back</button>
                        <h1>{opp.title}</h1>
                        <p>{opp.description}</p>
                        <p>{opp.fundingDescription}</p>
                        <p>{opp.fullEcon ? "✔ Full economic costing" : "✗ Full economic costing"}</p>
                        <p>{JSON.parse(opp.dates).map((date) =>
                            <span>{date.title}: {date.date}<br /></span>
                        )}</p>
                        <p>Tags: {opp.tags.join(', ')}</p>
                        
                        <hr />
                        {editing}

                    </div>
                </div>
            )
        }

    }

    mailtoLink() {
        var opp = this.state.selectedItem;
        var dates = JSON.parse(opp.dates).map((date) => date.title + ": " + date.date);
        var links = this.state.urls.map((url) => url.title + ": " + url.url);

        var subjectStr = "Funding Opportunity: " + opp.title;
        var bodyStr =   "I came across a funding opportunity that I thought you might like to see!%0A%0A" +
                        opp.title + " %0A%0A" +
                        opp.description + " %0A%0A" +
                        opp.fundingDescription + " %0A%0A" +
                        dates.join(" %0A") + " %0A%0A" +
                        links.join(" %0A") + " %0A%0A" +
                        "Read more at " + opp.url + " %0A%0A" +
                        "Shared from Idea to Grant browser extension";
        return "mailto:?body=" + bodyStr.replace(/ /g, '%20') + "&subject=" + subjectStr.replace(/ /g, '%20');
    }

    async getItem(itemLink) {
        console.log(itemLink);
        this.itemService.getItem(itemLink).then(item => {
            return item;
        }
        );
    }

    async getItems(i) {
        this.itemService.retrieveShortlist(this.props.user._links.self.href, i).then(shortlists => {
            console.log(JSON.stringify(shortlists));
            this.setState({ shortlist:shortlists })
            Promise.all(shortlists.map(item => {
                return this.itemService.getItem(item._links.opportunity.href);
            })).then(opps => {
                this.setState({ items:opps });
                this.filterItems(this.state.filter);
            })
        }
        );
    }

    getPages() {
        this.itemService.retrieveShortlistPages(this.props.user._links.self.href).then(pages => {
            this.setState({ pages: pages });
        }
        );
    }

    urlClick(item) {
        const shortlistItem = this.getShortlistItem(item);
        const urlsArr = JSON.parse(shortlistItem.urls);
        console.log(shortlistItem);
        console.log(urlsArr);

        if (urlsArr.length > 0) {
            this.setState({
                urls : JSON.parse(shortlistItem.urls),
            })
        }
 
        this.setState({
            status : shortlistItem.status,
            showDetails: true,
            selectedItem: item,
            editing: false
        });
    }

    getShortlistItem = (opp) => {
        var index = this.state.filteredItems.indexOf(opp);
        return this.state.filteredShortlist[index];
    }

    setShortlistItem = (opp, shortlistItem) => {
        var index = this.state.filteredItems.indexOf(opp);
        let dummyShortlist = this.state.filteredShortlist;
        dummyShortlist[index] = shortlistItem;
        this.setState({
            shortlist: dummyShortlist
        });
    }

    startEditing = async (e) => {
        e.preventDefault();
        this.setState({
            editing: true,
        });
    }

    submitChanges = async (e) => {
        e.preventDefault();

        let shortlistItem = this.getShortlistItem(this.state.selectedItem);
        let requestBody = {
            "status": this.state.status,
            "urls": JSON.stringify(this.state.urls),
        };
        console.log(requestBody);
        let response = await this.itemService.editShortlistItem(requestBody, shortlistItem._links.self.href);
        console.log("Response: " + JSON.stringify(response));

        this.setShortlistItem(this.state.selectedItem, response);
        this.setState({
            editing: false,
        });


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

    removeUrl = (index, e) => {
        e.preventDefault();
        var dummyUrls = this.state.urls;
        dummyUrls.splice(index, 1);
        this.setState({urls:dummyUrls});
    }

    addUrl = () => {
        var dummyUrls = this.state.urls;
        dummyUrls.push({title:"", url:""});
        this.setState({urls:dummyUrls});
    }

    addhttp(url) {
        if (!/^(?:ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    filterItems(f) {
        let dummyFilteredItems = [];
        let dummyFilteredShortlist = [];

        this.state.shortlist.forEach((item, index) => {
            if ((f.shortlisted && item.status == "shortlisted") ||
                (f.applying && item.status == "applying") ||
                (f.submitted && item.status == "submitted") ||
                (f.closed && item.status == "closed")) {
                    dummyFilteredShortlist.push(item);
                    dummyFilteredItems.push(this.state.items[index]);
                }
        });

        this.setState({
            filter: f,
            filteredItems: dummyFilteredItems,
            filteredShortlist: dummyFilteredShortlist
        });
    }

    handleDropdownChange = (e) => {
        e.persist();
        let selected = e.target.value;
        console.log("CHANGED:", selected);
        this.setState({ status: selected })
    }

    handleChange = (e) => {
        let name = e.target.title;
        let value = e.target.checked;
        let dummyFilters = this.state.filter;

        switch (name) {
            case "all":
                if (value) {
                    dummyFilters = {
                        all: true,
                        shortlisted: true,
                        applying: true,
                        submitted: true,
                        closed: true
                    }                            
                } else {
                    dummyFilters = {
                        all: false,
                        shortlisted: false,
                        applying: false,
                        submitted: false,
                        closed: false
                    }    
                }
                break;
            case "shortlisted":
                dummyFilters.shortlisted = value;
                break;
            case "applying":
                dummyFilters.applying = value;
                break;
            case "submitted":
                dummyFilters.submitted = value;
                break;
            case "closed":
                dummyFilters.closed = value;
                break;     
        }

        if (dummyFilters.shortlisted && dummyFilters.applying && dummyFilters.submitted && dummyFilters.closed &&
            !dummyFilters.all) {
                dummyFilters.all = true;
        }

        if (!(dummyFilters.shortlisted && dummyFilters.applying && dummyFilters.submitted && dummyFilters.closed)) {
            dummyFilters.all = false;
        }

        this.filterItems(dummyFilters);
        /*this.setState({
            filter: dummyFilters
        })*/

    }
    
    handlePageClick = (data) => {
        let selected = data.selected;
        this.getItems(selected);
    };

}

export default Shortlist
