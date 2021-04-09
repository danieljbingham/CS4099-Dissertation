import React, { Component } from 'react'
import './AddOpportunity.css'
import ItemService from './item-service'
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
const toDate = require('normalize-date');

class AddOpportunity extends Component {
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
        this.submitTab = this.submitTab.bind(this);
        this.state = {
            showDetails: false,

            title: "",
            url: "",
            dates: [{title:"", date:""}],
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
            tagifyProps: { whitelist: [""], value: this.state.tags }

        }
    }

    componentDidMount() {
        this.getTags();
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
                                onChange={(e) => this.handleDatesChange(index, e)} onBlur={(e) => this.handleDate(index, e)} />
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
                            tagifyRef={this.state.tagifyRef} // optional Ref object for the Tagify instance itself, to get access to inner-methods
                            settings={{
                                dropdown: {
                                    maxItems: 12,           // <- mixumum allowed rendered suggestions
                                    enabled: 0,             // <- show suggestions on focus
                                    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                                },
                                placeholder: "type some tags..."
                            }}
                            {...this.state.tagifyProps}   // dynamic props such as "loading", "showDropdown:'abc'", "value"
                            onChange={e => (e.persist(), this.setTags(e.target.value))}
                        />
                    </label>

                    <button type="submit" id="submit-btn">{this.props.user.role === "researcher" ? "Add to shortlist" : "Submit opportunity"}</button>
                </form>

            </div>
        )
    }
    
    scanPage = () => {
        browser.tabs.query({ active: true, currentWindow: true }, tabs => {
            const url = new URL(tabs[0].url).href;
            const title = tabs[0].title;
            this.setState({
                title: title,
                url: url,
                dates: [{title:"", date:""}],
                description: "",
                fundingDesc: "",
                tags: []
            })
            this.state.tagifyRef.current.removeAllTags();
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

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

            let response = await this.itemService.createItem(requestBody);

            
            if (this.props.user.role === "researcher") {
                let shortlistRequest = {
                    "user": this.props.user._links.self.href,
                    "opportunity": response._links.self.href,
                    "urls": "[]"
                }
                this.itemService.createShortlistItem(shortlistRequest)
            }
    
            this.setState({
                title: "",
                url: "",
                dates: [{title:"", date:""}],
                description: "",
                fundingDesc: "",
                fullEcon: false,
                tags: []
            })
            this.state.tagifyRef.current.removeAllTags();
    
            if (this.props.user.role === "researcher") {
                this.submitTab(2);
            } else {
                this.submitTab(1);
            }
        }
    }

    handleChange = (e) => {
        let name = e.target.title;
        let value = e.target.value;
        if (name != "fullEcon") {
            e.preventDefault();
        }

        this.inputValid(name, value);

        switch (name) {
            case "title":
                this.setState({title: value});
                break;
            case "url":
                this.setState({url: value});
                break;
            case "description":
                this.setState({description: value});
                break;
            case "fundingDesc":
                this.setState({fundingDesc: value});
                break;
            case "fullEcon":
                    this.setState({fullEcon: value});
                    break; 
            }

    }

    handleDatesChange = (index, e) => {
        e.preventDefault();

        let name = e.target.title;
        let value = e.target.value;
        let dummyDates = this.state.dates;


        switch (name) {
            case "title":
                dummyDates[index].title = value;
                break;
            case "date":
                dummyDates[index].date = value;
                break;
        }

        this.setState({dates: dummyDates});
        this.inputValid("dates", dummyDates);

    }

    handleDate = (index, e) => {
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
          

        let dummyDates = this.state.dates;
        dummyDates[index].date = normalisedDate;

        this.inputValid("dates", dummyDates);
        this.setState({dates: dummyDates});
    }

    normaliseDate = (value) => {
        // example ISOString: 2011-10-05T14:48:00.000Z
        // therefore split on T gives yyyy-mm-dd
        return toDate(value).toISOString().split('T')[0];
    }

    addDate = () => {
        var dummyDates = this.state.dates;
        dummyDates.push({title:"", date:""});
        this.setState({dates: dummyDates});
    }

    removeDate = (index, e) => {
        var dummyDates = this.state.dates;
        dummyDates.splice(index, 1);
        if (dummyDates.length == 0) {
            dummyDates = [{title:"", date:""}];
        }
        this.setState({dates: dummyDates});
    }

    removeDates = () => {
        var dummyDates = this.state.dates;

        for (let i = dummyDates.length - 1; i >= 0; i--) {
            if (!dummyDates[i].title || !dummyDates[i].date) { 
                dummyDates.splice(i, 1);
            }
        }
        
        if (dummyDates.length == 0) {
            dummyDates = [{title:"", date:""}];
        }
        this.setState({dates: dummyDates});
    }

    setTags = (values) => {
        if (!values) {
            this.setState({tags: []});
        } else {
            var tagArr = JSON.parse(values).map(item => item.value);
            this.setState({tags: tagArr});
        }
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


    inputValid(name, value) {

        switch (name) {
            case "title":
                if (!value || !value.trim()) {
                    this.setState({titleError: "You must include a title"});
                    return false;
                } else if (this.state.titleError) {
                    this.setState({titleError: ""});
                }
                break;
            case "url":
                if (!value || !value.trim()) {
                    this.setState({urlError: "You must include a url"});
                    return false;
                } else if (this.state.urlError) {
                    this.setState({urlError: ""});
                }
                break;
            case "description":
                if (!value || !value.trim()) {
                    this.setState({descriptionError: "You must include a description"});
                    return false;
                } else if (this.state.descriptionError) {
                    this.setState({descriptionError: ""});
                }
                break;
            case "fundingDesc":
                if (!value || !value.trim()) {
                    this.setState({fundingDescError: "You must include a funding description"});
                    return false;
                } else if (this.state.fundingDescError) {
                    this.setState({fundingDescError: ""});
                }
                break;
            case "dates": 
                if (value.length == 1 && (!value[0].title || !value[0].date)) {
                    this.setState({datesError: "You must include at least one date"});
                    return false;
                } else if (this.state.datesError) {
                    this.setState({datesError: ""});
                }
        }

        return true;

    }

    formValid() {
        if (this.inputValid("url", this.state.url)) {
            this.setState({url: this.addhttp(this.state.url)}); 
        }
        this.removeDates();
        return  this.inputValid("title", this.state.title) &
                this.inputValid("url", this.state.url) &
                this.inputValid("description", this.state.description) &
                this.inputValid("fundingDesc", this.state.fundingDesc) &
                this.inputValid("dates", this.state.dates);
    }

    addhttp(url) {
        if (!/^(?:ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }
}

export default AddOpportunity
