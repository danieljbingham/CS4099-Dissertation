import React, { Component } from 'react'
import './CurrentPage.css'
import ItemService from './item-service'
const toDate = require('normalize-date');

class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.addToShortlist = this.addToShortlist.bind(this);
        this.scanPage = this.scanPage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.getURL = this.getURL.bind(this);
        this.submitTab = this.submitTab.bind(this);
        this.state = {
            showDetails: false,
            title: "",
            url: "",
            date: "",
            description: "",
            domain: "",
            dateChanged: "",
            isResearcher: false
        }
    }

    render() {
        console.log(JSON.stringify(this.props))

        return (
            <div className="currentPage">

                <button type="button" id="scan" onClick={this.scanPage}>Scan Page</button>

                <div id="radios" onChange={this.handleRoleChange}>
                    <p>I am a...</p>
                    <label>
                        <input type="radio" value="Business Development Manager" checked={this.state.isResearcher === false} onChange={this.handleRoleChange} />
                        Business Development Manager
                    </label>

                    <label>
                        <input type="radio" value="Researcher" checked={this.state.isResearcher === true} onChange={this.handleRoleChange} />
                        Researcher
                    </label>
                </div>


                <form onSubmit={this.handleSubmit}>
                    <label>
                        Title:
                        <input type="text" value={this.props.currentPageObject.title} title="title" onChange={this.handleChange} />
                    </label>
                    <label>
                        URL:
                        <input type="text" value={this.props.currentPageObject.url} title="url" onChange={this.handleChange} />
                    </label>
                    <label>
                        Date (YYYY-MM-DD):
                        <input type="text" value={this.props.currentPageObject.date} title="date" onChange={this.handleChange} onBlur={this.handleDate} />
                    </label>
                    <label>
                        Description:
                        <textarea value={this.props.currentPageObject.description} title="description" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value={this.state.isResearcher ? "Add to shortlist" : "Submit opportunity"} />
                </form>

            </div>
        )
    }

    addToShortlist() {
        // send to api
        // remove button
        /*var tosend = {
                        "user":"http://localhost:8080/api/users/1",
            "opportunity":"http://localhost:8080/api/opportunities/4"
        }*/
        var tosend = "http://localhost:8080/api/users/1 http://localhost:8080/api/opportunities/4"
        this.itemService.createItem(tosend);
    }

    scanPage = () => {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
            const url = new URL(tabs[0].url);
            const title = tabs[0].title;
            /*this.setState({
                title: title,
                url: url,
                date: "",
                description: ""
            });*/
            this.props.setTitle(title);
            this.props.setUrl(url);
            this.props.setDate("");
            this.props.setDescription("");
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submit");
        let requestBody = {
            "title": this.props.currentPageObject.title,
            "url": this.props.currentPageObject.url,
            "date": this.props.currentPageObject.date,
            "description": this.props.currentPageObject.description
        };
        console.log(requestBody);
        let response = await this.itemService.createItem(requestBody);
        console.log("Response: " + JSON.stringify(response));

        if (this.state.isResearcher === true) {
            let shortlistRequest = {
                // TODO unhardlink this
                "user": "http://localhost:8080/api/users/1",
                "opportunity": response._links.self.href
            }
            console.log("shortlistRequest: " + JSON.stringify(shortlistRequest));
            this.itemService.createShortlistItem(shortlistRequest)
        }

        /*this.setState({
            title: "",
            url: "",
            date: "",
            description: ""
        });*/
        this.props.setTitle("");
        this.props.setUrl("");
        this.props.setDate("");
        this.props.setDescription("");


        if (this.state.isResearcher === true) {
            this.submitTab(2);
        } else {
            this.submitTab(1);
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        let name = e.target.title;
        let value = e.target.value;
        //this.setState({ [name]: value });

        switch (name) {
            case "title":
                this.props.setTitle(value);
                break;
            case "url":
                this.props.setUrl(value);
                break;
            case "date":
                this.props.setDate(value);
                break;
            case "description":
                this.props.setDescription(value);
                break;
        }

        if (name === "date") {
            this.setState({ dateChanged: true });
        } else {
            if (this.state.dateChanged === true) {
                this.normaliseDate(this.props.currentPageObject.date);
                this.setState({ dateChanged: false });
            }
        }
    }

    handleDate = (e) => {
        e.preventDefault();
        let value = e.target.value;
        this.normaliseDate(value);
    }

    normaliseDate = (value) => {
        // example ISOString: 2011-10-05T14:48:00.000Z
        // therefore split on T gives yyyy-mm-dd
        value = toDate(value).toISOString().split('T')[0];
        this.props.setDate(value);
        //this.setState({ "date": value });
    }

    handleRoleChange = (e) => {
        e.target.value === "Researcher" ? this.setState({ isResearcher: true }) : this.setState({ isResearcher: false });
        console.log(e.target.value + " " + this.state.isResearcher);
    }

    getURL() {
        //let querying = window.tabs.query({active: true, lastFocusedWindow: true})
        //console.log(querying);
        //return querying;
    }

    submitTab(i) {
        this.props.changeTab(i);
    }
}

export default CurrentPage
