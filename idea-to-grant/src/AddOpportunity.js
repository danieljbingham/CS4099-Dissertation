import React, { Component } from 'react'
import './AddOpportunity.css'
import ItemService from './item-service'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file for tagify
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
const toDate = require('normalize-date'); // package for converting dates

class AddOpportunity extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService(this.props.accessToken);
        this.scanPage = this.scanPage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateFormat = this.handleDateFormat.bind(this);
        this.handleDatesChange = this.handleDatesChange.bind(this);
        this.addDate = this.addDate.bind(this);
        this.submitTab = this.submitTab.bind(this);
        this.state = {
            showDetails: false,

            title: "",
            url: "",
            dates: [{ title: "", date: "" }],
            description: "",
            fullEcon: false,
            fundingDesc: "",
            tags: [],

            titleError: "",
            urlError: "",
            descriptionError: "",
            fundingDescError: "",
            datesError: ""
        }
        this.state = {
            ...this.state,
            tagifyRef: React.createRef(),
            tagifyProps: { whitelist: this.props.tags, value: this.state.tags }
        }
    }

    // function gets called if props update
    componentDidUpdate(prevProps) {
        if (this.props.tags !== prevProps.tags) {
            let dummyTagifyProps = this.state.tagifyProps;
            dummyTagifyProps.whitelist = this.props.tags;
            this.setState({
                tagifyProps: dummyTagifyProps
            })
        }
    }


    render() {

        return (
            <div className="addOpportunity">
                <button type="button" id="scan" onClick={this.scanPage}>Scan Page</button>

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Title:
                        <input type="text" value={this.state.title} title="title" onChange={this.handleChange} />
                        {(this.state.titleError) &&
                            <p className="error">{this.state.titleError}</p>}
                    </label>
                    <label>
                        URL:
                        <input type="text" value={this.state.url} title="url" onChange={this.handleChange} />
                        {(this.state.urlError) &&
                            <p className="error">{this.state.urlError}</p>}
                    </label>
                    <label>
                        Deadlines:
                            {this.state.dates.map((dateObj, index) =>
                        <div className="dates">
                            <input type="text" title="title" value={dateObj.title} onChange={(e) => this.handleDatesChange(index, e)} />
                            <input type="text" className="date" placeholder="yyyy-mm-dd" value={dateObj.date} title="date"
                                onChange={(e) => this.handleDatesChange(index, e)} onBlur={(e) => this.handleDateFormat(index, e)} />
                            <button id="remove" title="Remove" type="button" onClick={(e) => this.removeDate(index, e)}>-</button>
                        </div>
                    )}
                        {(this.state.datesError) &&
                            <p className="error dateError">{this.state.datesError}</p>}
                        <button id="add" className="secondary-btn" onClick={this.addDate} type="button">Add another date</button>
                    </label>
                    <label>
                        Description:
                        <textarea value={this.state.description} title="description" onChange={this.handleChange} />
                        {(this.state.descriptionError) &&
                            <p className="error">{this.state.descriptionError}</p>}
                    </label>
                    <label>
                        Funding Information:
                        <textarea value={this.state.fundingDesc} title="fundingDesc" onChange={this.handleChange} />
                        {(this.state.fundingDescError) &&
                            <p className="error">{this.state.fundingDescError}</p>}

                    </label>
                    <label>
                        Full Economic Costing?
                        <input type="checkbox" checked={this.state.fullEcon} title="fullEcon" onChange={this.handleChange} />
                        <br />
                    </label>
                    <label>
                        Tags:
                        <Tags
                            tagifyRef={this.state.tagifyRef} // Ref object for Tagify instance to get access to inner-methods
                            settings={{
                                dropdown: {
                                    maxItems: 12,           
                                    enabled: 0,             
                                    closeOnSelect: false   
                                },
                                placeholder: "Type some tags..."
                            }}
                            {...this.state.tagifyProps}   // dynamic props
                            onChange={e => (e.persist(), this.setTags(e.target.value))}
                        />
                    </label>

                    <button type="submit" id="submit-btn">{this.props.user.role === "researcher" ? "Add to shortlist" : "Submit opportunity"}</button>
                </form>

            </div>
        )
    }

    // onClick function for Scan Page button, gets information from active tab
    // and displays it in the sidebar
    scanPage = () => {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
            const url = new URL(tabs[0].url).href;
            const title = tabs[0].title;
            this.setState({
                title: title,
                url: url,
                dates: [{ title: "", date: "" }],
                description: "",
                fundingDesc: "",
                tags: []
            })
            this.state.tagifyRef.current.removeAllTags();
        });
    }

    // onClick function for form submit button
    handleSubmit = async (e) => {
        e.preventDefault();

        // validate form before posting to API
        if (this.formValid()) {
            let requestBody = {
                "title": this.state.title,
                "url": this.state.url,
                "dates": JSON.stringify(this.state.dates),
                "description": this.state.description,
                "fundingDescription": this.state.fundingDesc,
                "fullEcon": this.state.fullEcon,
                "publicOpportunity": this.props.user.role !== "researcher",
                "tags": this.state.tags
            };

            let response = await this.itemService.createOpportunity(requestBody);

            // if the user is a researcher, then the the opportunity must
            // also be added to the user's shortlist, which is another API call
            if (this.props.user.role === "researcher") {
                let shortlistRequest = {
                    "user": this.props.user._links.self.href,
                    "opportunity": response._links.self.href,
                    "urls": "[]",
                    "checklist": "[]",
                    "status": "shortlisted"
                }
                await this.itemService.createShortlistItem(shortlistRequest)
            }

            // reset form after submission
            this.setState({
                title: "",
                url: "",
                dates: [{ title: "", date: "" }],
                description: "",
                fundingDesc: "",
                fullEcon: false,
                tags: []
            })
            this.state.tagifyRef.current.removeAllTags();

            // if a researcher submits, take them to their shortlist
            // if a bdm submits, take them to the funding calls tab
            if (this.props.user.role === "researcher") {
                this.props.recacheShortlistPages();
                this.props.recacheShortlist();
                this.submitTab(2);
            } else {
                this.props.recacheOppPages();
                this.submitTab(1);
            }
        }
    }

    // onChange function to deal with changes on form inputs,
    // simply sets state as needed for controlled components
    handleChange = (e) => {
        let name = e.target.title;
        let value = e.target.value;
        if (name != "fullEcon") {
            e.preventDefault();
        }

        this.inputValid(name, value);

        switch (name) {
            case "title":
                this.setState({ title: value });
                break;
            case "url":
                this.setState({ url: value });
                break;
            case "description":
                this.setState({ description: value });
                break;
            case "fundingDesc":
                this.setState({ fundingDesc: value });
                break;
            case "fullEcon":
                this.setState({ fullEcon: value });
                break;
        }

    }

    // onChange function to deal with changes on date inputs
    handleDatesChange = (index, e) => {
        e.preventDefault();

        let name = e.target.title;
        let value = e.target.value;
        let dummyDates = this.state.dates;

        // change the state for the correct date object in array of dates
        switch (name) {
            case "title":
                dummyDates[index].title = value;
                break;
            case "date":
                dummyDates[index].date = value;
                break;
        }

        this.setState({ dates: dummyDates });
        this.inputValid("dates", dummyDates);

    }

    // onBlur function for date input,
    // i.e. when input loses focus, try to format the date automatically
    handleDateFormat = (index, e) => {
        e.preventDefault();
        let value = e.target.value;

        let normalisedDate;
        try {
            normalisedDate = this.normaliseDate(value);
        } catch (err) {
            if (err instanceof RangeError) {
                normalisedDate = "";
            }
        }
    
        // update state for date object
        let dummyDates = this.state.dates;
        dummyDates[index].date = normalisedDate;

        this.inputValid("dates", dummyDates);
        this.setState({ dates: dummyDates });
    }

    // format date to yyyy-mm-dd
    normaliseDate = (value) => {
        // example ISOString: 2011-10-05T14:48:00.000Z
        // therefore split on T gives yyyy-mm-dd
        return toDate(value).toISOString().split('T')[0];
    }

    // onClick function for adding new date
    addDate = () => {
        let dummyDates = this.state.dates;
        dummyDates.push({ title: "", date: "" });
        this.setState({ dates: dummyDates });
    }

    // onClick function for removing date
    removeDate = (index, e) => {
        let dummyDates = this.state.dates;
        dummyDates.splice(index, 1);
        if (dummyDates.length == 0) {
            dummyDates = [{ title: "", date: "" }];
        }
        this.setState({ dates: dummyDates });
    }

    // remove all empty dates, used when clicking submit,
    // so this ensures no empty dates are posted to API
    removeDates = () => {
        let dummyDates = this.state.dates;

        for (let i = dummyDates.length - 1; i >= 0; i--) {
            if (!dummyDates[i].title || !dummyDates[i].date) {
                dummyDates.splice(i, 1);
            }
        }

        if (dummyDates.length == 0) {
            dummyDates = [{ title: "", date: "" }];
        }
        this.setState({ dates: dummyDates });
    }

    // onChange function for Tags component (saves tags in state),
    // needed for making it a controlled component
    setTags = (values) => {
        if (!values) {
            this.setState({ tags: [] });
        } else {
            let tagArr = JSON.parse(values).map(item => item.value);
            this.setState({ tags: tagArr });
        }
    }

    // change tab on submit
    submitTab(i) {
        this.props.changeTab(i);
    }


    // validate a given input, display error message if there is a problem
    inputValid(name, value) {

        switch (name) {
            case "title":
                if (!value || !value.trim()) {
                    this.setState({ titleError: "You must include a title" });
                    return false;
                } else if (this.state.titleError) {
                    this.setState({ titleError: "" });
                }
                break;

            case "url":
                if (!value || !value.trim()) {
                    this.setState({ urlError: "You must include a url" });
                    return false;
                } else if (this.state.urlError) {
                    this.setState({ urlError: "" });
                }
                break;

            case "description":
                if (!value || !value.trim()) {
                    this.setState({ descriptionError: "You must include a description" });
                    return false;
                } else if (this.state.descriptionError) {
                    this.setState({ descriptionError: "" });
                }
                break;

            case "fundingDesc":
                if (!value || !value.trim()) {
                    this.setState({ fundingDescError: "You must include a funding description" });
                    return false;
                } else if (this.state.fundingDescError) {
                    this.setState({ fundingDescError: "" });
                }
                break;

            case "dates":
                // check dates is not empty
                // empty if length is 0 or length is 1 (default) with either title or date not filled in
                if (value.length == 0 || (value.length == 1 && (!value[0].title || !value[0].date))) {
                    this.setState({ datesError: "You must include at least one date" });
                    return false;
                } else if (this.state.datesError) {
                    this.setState({ datesError: "" });
                }
        }

        return true;

    }

    // check validity of all inputs before submitting form
    formValid() {
        if (this.inputValid("url", this.state.url)) {
            // add http to url first to ensure it is valid
            this.setState({ url: this.addhttp(this.state.url) });
        }
        this.removeDates(); // remove blank dates before checking

        return this.inputValid("title", this.state.title) &
            this.inputValid("url", this.state.url) &
            this.inputValid("description", this.state.description) &
            this.inputValid("fundingDesc", this.state.fundingDesc) &
            this.inputValid("dates", this.state.dates);
    }

    // add http to a url if it doesn't already have a protocol
    addhttp(url) {
        if (!/^(?:ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }
}

export default AddOpportunity
