import React, { Component } from 'react'
import './CurrentPage.css'
import ItemService from './item-service'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
const toDate = require('normalize-date');

class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.scanPage = this.scanPage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleDatesChange = this.handleDatesChange.bind(this);
        this.addDate = this.addDate.bind(this);
        this.getTags = this.getTags.bind(this);
        this.getURL = this.getURL.bind(this);
        this.submitTab = this.submitTab.bind(this);
        this.state = {
            showDetails: false,
            dateChanged: "",
            tagifyRef: React.createRef(),
            tagifyProps: { whitelist: [""], value: this.props.currentPageObject.tags }

        }
    }

    componentDidMount() {
        this.getTags();
    }

    render() {

        return (
            <div className="currentPage">
                {/*<p>Welcome back {this.props.user.name}</p><br />*/}
                <button type="button" id="scan" onClick={this.scanPage}>Scan Page</button>

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Title:
                        <input type="text" value={this.props.currentPageObject.title} title="title" onChange={this.handleChange} />
                    </label>
                    <label>
                        URL:
                        <input type="text" value={this.props.currentPageObject.url} title="url" onChange={this.handleChange} />
                    </label>
                    {/*<label>
                        Date (YYYY-MM-DD):
                        <input type="text" value={this.props.currentPageObject.date} title="date" onChange={this.handleChange} onBlur={this.handleDate} />
                    </label>*/}
                    <label>
                        Deadlines:
                            {this.props.currentPageObject.dates.map((dateObj, index) => 
                                <div className="dates">
                                <input type="text" title="title" value={dateObj.title} onChange={(e) => this.handleDatesChange(index, e)} />
                                <input type="date" title="date" value={dateObj.date} onChange={(e) => this.handleDatesChange(index, e)} /> 
                                </div>                               
                            )}
                        <button id="add" onClick={this.addDate} type="button">Add another date</button>

                    </label>
                    <label>
                        Description:
                        <textarea value={this.props.currentPageObject.description} title="description" onChange={this.handleChange} />
                    </label>
                    <label>
                        Funding Information:
                        <textarea value={this.props.currentPageObject.fundingDesc} title="fundingDesc" onChange={this.handleChange} />
                    </label>
                    <label>
                        Full Economic Costing?
                        <input type="checkbox" checked={this.props.currentPageObject.fullEcon} title="fullEcon" onChange={this.handleChange} />
                        <br />
                    </label>
                    <label>
                        Tags:
                        <Tags
                            tagifyRef={this.state.tagifyRef} // optional Ref object for the Tagify instance itself, to get access to inner-methods
                            settings={{
                                dropdown: {
                                    maxItems: 20,           // <- mixumum allowed rendered suggestions
                                    enabled: 0,             // <- show suggestions on focus
                                    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                                },
                                placeholder: "type some tags..."
                            }}
                            {...this.state.tagifyProps}   // dynamic props such as "loading", "showDropdown:'abc'", "value"
                            onChange={e => (e.persist(), console.log("CHANGED:", e.target.value), this.setTags(e.target.value))}
                        />
                    </label>

                    <input type="submit" value={this.props.user.role === "researcher" ? "Add to shortlist" : "Submit opportunity"} />
                </form>

            </div>
        )
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
            this.props.setTags([]);
            this.state.tagifyRef.current.removeAllTags();
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log("submit");
        let requestBody = {
            "title": this.props.currentPageObject.title,
            "url": this.props.currentPageObject.url,
            "dates": JSON.stringify(this.props.currentPageObject.dates),
            "description": this.props.currentPageObject.description,
            "fundingDescription": this.props.currentPageObject.fundingDesc,
            "fullEcon": this.props.currentPageObject.fullEcon,
            "public": this.props.user.role !== "researcher",
            "tags": this.props.currentPageObject.tags
        };
        console.log(requestBody);
        let response = await this.itemService.createItem(requestBody);
        console.log("Response: " + JSON.stringify(response));

        if (this.props.user.role === "researcher") {
            let shortlistRequest = {
                "user": this.props.user._links.self.href,
                "opportunity": response._links.self.href,
                "urls": "[]"
            }
            console.log("shortlistRequest: " + JSON.stringify(shortlistRequest));
            this.itemService.createShortlistItem(shortlistRequest)
        }

        this.props.setTitle("");
        this.props.setUrl("");
        this.props.setDates([{title:"",date:""}]);
        this.props.setDescription("");
        this.props.setFundingDesc("");
        this.props.setFullEcon(false);
        this.props.setTags([]);
        this.state.tagifyRef.current.removeAllTags();

        if (this.props.user.role === "researcher") {
            this.submitTab(2);
        } else {
            this.submitTab(1);
        }
    }

    handleChange = (e) => {
        let name = e.target.title;
        let value = e.target.value;
        if (name != "fullEcon") {
            e.preventDefault();
        }

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
            case "fullEcon":
                console.log(e.target.checked);
                this.props.setFullEcon(e.target.checked);
                break; 
            case "fundingDesc":
                this.props.setFundingDesc(value);
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

    handleDatesChange = (index, e) => {
        e.preventDefault();

        let name = e.target.title;
        let value = e.target.value;
        var dummyDates = this.props.currentPageObject.dates;

        switch (name) {
            case "title":
                dummyDates[index].title = value;
                break;
            case "date":
                dummyDates[index].date = value;
                break;
        }

        this.props.setDates(dummyDates);

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

    addDate = () => {
        var dummyDates = this.props.currentPageObject.dates;
        dummyDates.push({title:"", date:""});
        this.props.setDates(dummyDates);
    }

    setTags = (values) => {
        var tagArr = JSON.parse(values).map(item => item.value);
        this.props.setTags(tagArr);
    }

    getURL() {
        //let querying = window.tabs.query({active: true, lastFocusedWindow: true})
        //console.log(querying);
        //return querying;
    }

    getTags() {

        this.itemService.retrieveTags().then(tags => {
            var dummyTagifyProps = this.state.tagifyProps;
            dummyTagifyProps.whitelist = tags;
            this.setState({
                tagifyProps: dummyTagifyProps
            })
        }
        );

    }

    submitTab(i) {
        this.props.changeTab(i);
    }
}

export default CurrentPage
