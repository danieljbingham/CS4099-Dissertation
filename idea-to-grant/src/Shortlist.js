import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import ReactPaginate from 'react-paginate'; // pagination
import './Shortlist.css'

class Shortlist extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService(this.props.accessToken);
        this.urlClick = this.urlClick.bind(this)
        this.state = {
            pages: this.props.pages,
            originalPages: this.props.pages,
            pageNo: 0,
            shortlist: this.props.shortlist,
            filteredItems: [],
            filteredShortlist: [],
            selectedItem: {},
            showDetails: false,
            editing: false,
            urls: [{ title: "", url: "" }],
            checklist: [{ title: "", checked: false }],
            status: "",
            confirmDeletion: false,
            filter: {
                all: true,
                shortlisted: true,
                applying: true,
                submitted: true,
                closed: true
            }
        }
    }

    // function gets called on load
    async componentDidMount() {
        await this.filterItems({
            all: true,
            shortlisted: true,
            applying: true,
            submitted: true,
            closed: true
        }, this.state.shortlist);
    }

    // function gets called if props update
    async componentDidUpdate(prevProps) {
        if (this.props.pages !== prevProps.pages) {
            this.setState({
                originalPages: this.props.pages
            })
        }

        if (this.props.shortlist !== prevProps.shortlist) {
            this.setState({
                shortlist: this.props.shortlist
            })
            await this.filterItems(this.state.filter, this.props.shortlist);            
        }

    }

    render() {
        console.log("Filtered items ");
        console.log(this.state.filteredItems)
        console.log("Props shortlist ")
        console.log(this.props.shortlist)
        console.log("State Shortlist ")
        console.log(this.state.shortlist)

        // map opportunities to list of Opportunity components
        const items = this.state.filteredItems.slice(this.state.pageNo * 5, this.state.pageNo * 5 + 5);
        if (!items) return null;
        const listItems = items.reduce((listItems, item) => {
            if (item) {
                listItems.push(<Opportunity opportunity={item} onClick={this.urlClick} />)
            }
            return listItems;
        }, []);

        console.log("Opps")
        console.log(listItems)

        if (this.state.showDetails == false) {
            // default view for this tab, list all shortlisted opportunities
            return (
                <div className="shortlist">

                    <div className="filters">
                        <label>
                            Show all
                        <input type="checkbox" checked={this.state.filter.all} title="all" onChange={this.handleCheckboxChange} />
                        </label>
                        <label>
                            Shortlisted
                        <input type="checkbox" checked={this.state.filter.shortlisted} title="shortlisted" onChange={this.handleCheckboxChange} />
                        </label>
                        <label>
                            Applying
                        <input type="checkbox" checked={this.state.filter.applying} title="applying" onChange={this.handleCheckboxChange} />
                        </label>
                        <label>
                            Submitted
                        <input type="checkbox" checked={this.state.filter.submitted} title="submitted" onChange={this.handleCheckboxChange} />
                        </label>
                        <label>
                            Closed
                        <input type="checkbox" checked={this.state.filter.closed} title="closed" onChange={this.handleCheckboxChange} />
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
                        forcePage={this.state.pageNo}
                    />

                </div>
            )
        } else {
            // detailed view for a single selected opportunity

            const opp = this.state.selectedItem;

            var editing = null;
            if (this.state.editing) {
                // in editing mode (i.e. adding links, changing status etc)
                editing = <div>
                    <br />
                    <label>
                        Links:
                        {this.state.urls.map((urlObj, index) =>
                        <div className="linksEditing">
                            <input type="text" title="title" placeholder="Resource name" value={urlObj.title} onChange={(e) => this.handleUrlsChange(index, e)} />
                            <input type="text" title="url" placeholder="URL" value={urlObj.url} onChange={(e) => this.handleUrlsChange(index, e)} />
                            <button className="remove" title="Remove" onClick={(e) => this.removeUrl(index, e)}>-</button>
                        </div>
                    )}
                        <button className="add secondary-btn" onClick={this.addUrl} type="button">Add another URL</button>
                    </label>
                    <br />

                    <label id="checklistLabel">
                        Checklist:
                        {this.state.checklist.map((chkObj, index) =>
                        <div className="checklistEditing">
                            <input type="checkbox" checked={chkObj.checked} title="checkbox" onChange={(e) => this.handleChecklistChange(index, e)} />
                            <input type="text" title="title" placeholder="Task" value={chkObj.title} onChange={(e) => this.handleChecklistChange(index, e)} />
                            <button className="remove" title="Remove" onClick={(e) => this.removeChecklist(index, e)}>-</button>
                        </div>
                    )}
                        <button className="add secondary-btn" onClick={this.addChecklist} type="button">Add another task</button>
                    </label>
                    <br />
                    <br />

                    <label>
                        Set status:
                        <br />
                        <select value={this.state.status} onChange={this.handleDropdownChange} required="required">
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
                // not in editing mode, just show opportunity details 
                editing = <div>
                    <br />
                    <label>
                        Links:
                        {this.state.urls.length > 0 && (this.state.urls[0].url != "" && this.state.urls[0].title != "") ?
                            this.state.urls.map((urlObj, index) =>
                                <a href={this.addhttp(urlObj.url)} className="links">
                                    <p>{urlObj.title}</p>
                                </a>
                            ) : <span> none<br /></span>
                        }
                    </label>
                    <br />

                    <label>
                        Checklist:
                        {this.state.checklist.length > 0 && (this.state.checklist[0].title != "") ?
                            this.state.checklist.map((chkObj, index) =>
                                <p>{chkObj.checked ? "☑️" : "☐"} {chkObj.title}</p>
                            ) : <span> none<br /></span>
                        }
                    </label>
                    <br />

                    <label>
                        <p>Status: {this.state.status}</p>
                    </label>

                    <button id="edit" type="button" onClick={this.startEditing}>Edit</button>
                    <button id="share" class="secondary-btn" onClick={(e) => window.open(this.mailtoLink())} target="_blank">Share by email</button>

                    <br />

                    <button className="removeShortlist" type="button" onClick={this.confirmDeletion}>Remove from shortlist</button>

                    <br />
                    {(this.state.confirmDeletion) &&
                        <button type="button" className="removeShortlist" onClick={this.handleRemove}>Confirm removal</button>
                    }
                    {(this.state.confirmDeletion) &&
                        <button type="button" class="secondary-btn" onClick={this.cancelConfirmDeletion}>Cancel</button>
                    }
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

    // generate mailto link for the selected opportunity
    mailtoLink() {
        var opp = this.state.selectedItem;
        var dates = JSON.parse(opp.dates).map((date) => date.title + ": " + date.date);
        var links = this.state.urls.map((url) => url.title + ": " + url.url);

        var subjectStr = "Funding Opportunity: " + opp.title;
        var bodyStr = "I came across a funding opportunity that I thought you might like to see!%0A%0A" +
            opp.title + " %0A%0A" +
            opp.description + " %0A%0A" +
            opp.fundingDescription + " %0A%0A" +
            dates.join(" %0A") + " %0A%0A" +
            links.join(" %0A") + " %0A%0A" +
            "Read more at " + opp.url + " %0A%0A" +
            "Shared from Idea to Grant browser extension";

        return "mailto:?body=" + bodyStr.replace(/ /g, '%20') + "&subject=" + subjectStr.replace(/ /g, '%20');
    }

    // click function for individual opportunity (Read more... link)
    urlClick(item) {
        // get opportunity details then set this as the selected opportunity
        const shortlistItem = this.getShortlistItem(item);
        const urlsArr = JSON.parse(shortlistItem.urls);
        const checklistArr = JSON.parse(shortlistItem.checklist);

        if (urlsArr.length > 0) {
            this.setState({
                urls: urlsArr,
            })
        }

        if (checklistArr.length > 0) {
            this.setState({
                checklist: checklistArr,
            })
        }

        this.setState({
            status: shortlistItem.status,
            showDetails: true,
            selectedItem: item,
            editing: false
        });
    }

    // get shortlist entry for the given opportunity
    getShortlistItem = (opp) => {
        var index = this.state.filteredItems.indexOf(opp);
        return this.state.filteredShortlist[index];
    }

    // updates shorlist item after changes made in editing mode
    setShortlistItem = (opp, shortlistItem) => {
        var index = this.state.filteredItems.indexOf(opp);
        let dummyShortlist = this.state.filteredShortlist;
        dummyShortlist[index] = shortlistItem;
        this.setState({
            shortlist: dummyShortlist
        });
    }

    // click function for going into editing mode
    startEditing = async (e) => {
        e.preventDefault();
        this.setState({
            editing: true,
        });
    }

    // click function for submitting changes in editing mode
    submitChanges = async (e) => {
        e.preventDefault();

        this.removeBlankUrls();
        this.removeBlankChecklist();

        let shortlistItem = this.getShortlistItem(this.state.selectedItem);
        let requestBody = {
            "status": this.state.status,
            "urls": JSON.stringify(this.state.urls),
            "checklist": JSON.stringify(this.state.checklist)
        };

        let response = await this.itemService.editShortlistItem(requestBody, shortlistItem._links.self.href);

        this.setShortlistItem(this.state.selectedItem, response);
        this.setState({
            editing: false,
        });
    }

    // click function for back button
    backToOpportunities = async (e) => {
        e.preventDefault();
        this.setState({
            showDetails: false,
            urls: [{ title: "", url: "" }],
            checklist: [{ title: "", checked: false }]
        });
    }

    // change function for adding links to a shortlisted opportunity
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

        this.setState({ urls: dummyUrls });
    }

    // click function for removing a link from shortlisted opportunity
    removeUrl = (index, e) => {
        e.preventDefault();
        var dummyUrls = this.state.urls;
        dummyUrls.splice(index, 1);
        this.setState({ urls: dummyUrls });
    }

    // click function for adding space for a link to a shortlisted opportunity
    addUrl = () => {
        var dummyUrls = this.state.urls;
        dummyUrls.push({ title: "", url: "" });
        this.setState({ urls: dummyUrls });
    }

    // add http to a url if it doesn't already have a protocol
    addhttp(url) {
        if (!/^(?:ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    // filter opportunities based on status checkboxes
    filterItems = async (f, shortlist) => {
        let dummyFilteredItems = [];
        let dummyFilteredShortlist = [];

        // start by clearing pages
        this.setState({
            filteredItems: dummyFilteredItems,
            filteredShortlist: dummyFilteredShortlist,
            pageNo: 0,
            pages: 0
        });

        // iterate through opportunities and add to array if 
        // it matches one of the selected checkboxes
        
        for (const item of shortlist) {
            if ((f.shortlisted && item.status == "shortlisted") ||
                (f.applying && item.status == "applying") ||
                (f.submitted && item.status == "submitted") ||
                (f.closed && item.status == "closed")) {

                let opp = await this.props.getShortlistOpportunity(item._links.opportunity.href);
                dummyFilteredShortlist.push(item);
                dummyFilteredItems.push(opp);
                this.setState({
                    filteredItems: dummyFilteredItems,
                    filteredShortlist: dummyFilteredShortlist,
                    pageNo: 0,
                    pages: Math.ceil(dummyFilteredShortlist.length / 5)
                });

            }
        };

        this.setState({
            filter: f
        });
    }

    // onChange function for status dropdown
    handleDropdownChange = (e) => {
        e.persist();
        let selected = e.target.value;
        this.setState({ status: selected })
    }

    // onChange function for checkboxes, sets the statuses as necessary
    handleCheckboxChange = async (e) => {
        let name = e.target.title;
        let value = e.target.checked;
        let dummyFilters = this.state.filter;

        switch (name) {
            case "all":
                // if the "all" checkbox is checked
                // then all status should either be ticked,
                // or all should be unticked
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

        await this.filterItems(dummyFilters, this.state.shortlist);
    }

    // click function for pagination
    handlePageClick = (data) => {
        let selected = data.selected;
        this.setState({ pageNo: selected });
    };

    // change function for adding list item to checklist
    handleChecklistChange = (index, e) => {

        let name = e.target.title;
        let value = e.target.value;
        var dummyChecklist = this.state.checklist;

        switch (name) {
            case "title":
                dummyChecklist[index].title = value;
                break;
            case "checkbox":
                dummyChecklist[index].checked = e.target.checked;
                break;
        }

        this.setState({ checklist: dummyChecklist });
    }

    // click function for removing a list item from checklist
    removeChecklist = (index, e) => {
        e.preventDefault();
        var dummyChecklist = this.state.checklist;
        dummyChecklist.splice(index, 1);
        this.setState({ checklist: dummyChecklist });
    }

    // click function for adding space for a list item in checklist
    addChecklist = () => {
        var dummyChecklist = this.state.checklist;
        dummyChecklist.push({ title: "", checked: false });
        this.setState({ checklist: dummyChecklist });
    }

    // remove checklist entries without data
    removeBlankChecklist() {
        let dummyChecklist = this.state.checklist;
    
        for (let i = dummyChecklist.length - 1; i >= 0; i--) {
            if (!dummyChecklist[i].title) {
                dummyChecklist.splice(i, 1);
            }
        }

        if (dummyChecklist.length == 0) {
            dummyChecklist = [];
        }
        this.setState({ dates: dummyChecklist });
    }

    // remove link entries without data
    removeBlankUrls() {
        let dummyUrls = this.state.urls;
    
        for (let i = dummyUrls.length - 1; i >= 0; i--) {
            if (!dummyUrls[i].title || !dummyUrls[i].url) {
                dummyUrls.splice(i, 1);
            }
        }

        if (dummyUrls.length == 0) {
            dummyUrls = [];
        }

        this.setState({ dates: dummyUrls });
    }

    // submit function for removing from shortlist
    handleRemove = async (e) => {
        e.preventDefault();

        await this.itemService.removeShortlist(this.getShortlistItem(this.state.selectedItem)._links.self.href);
        this.props.recacheShortlistPages();
        this.props.recacheShortlist();
        this.setState({ showDetails: false, pageNo: 0 });
    }

    // click event for cancel choice when deleting
    cancelConfirmDeletion = (e) => {
        this.setState({ confirmDeletion: false });
    }

    // click event for deleting, state indicates that the user should be
    // asked to confirm their choice to delete
    confirmDeletion = (e) => {
        this.setState({ confirmDeletion: true });
    }

}

export default Shortlist
