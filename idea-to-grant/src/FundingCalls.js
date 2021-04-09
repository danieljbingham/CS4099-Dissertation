import React, { Component, useRef, useState } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import ReactPaginate from 'react-paginate';
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import './FundingCalls.css'


class FundingCalls extends Component {

    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this);
        this.state = {
            items: [],
            taggedItems: [],
            pages: 0,
            originalPages: 0,
            pageNo: 0,
            selectValue: "placeholder",
            tags: [],
            tagPresets: [],
            showDetails: false,
            selectedItem: {},
            showTitleInput: false,
            tagPresetTitle: "",
            tagifyRef: React.createRef(),
            tagifyProps: {whitelist: []},
            settings: {
                dropdown:{
                    maxItems: 12,           // <- mixumum allowed rendered suggestions
                    enabled: 0,             // <- show suggestions on focus
                    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                },
                placeholder:"Type some tags..."
            }
        }
    }

    componentDidMount() {
        this.getPages();
        this.getItems(0);
        this.getTags();
        this.getTagPresets();
    }

    render() {

        const items = this.state.items;
        if (!items) return null;
        const listItems = items.map((item) =>
            <Opportunity opportunity={item} onClick={this.urlClick} />
        );

        const tagPresets = this.state.tagPresets;
        let tagPresetsOptions = [];
        tagPresetsOptions = tagPresets.map((preset) =>
            <option value={JSON.stringify(preset.tags)}>{preset.title}</option>
        );
        
        let tagTitleInput = <div id="tagTitle">
            <input type="text" value={this.state.tagPresetTitle} onChange={this.tagPresetTitleChange} title="title" placeholder="Title of your saved search..."/>
            <button id="saveTitle" title="Save Tag Preset" onClick={this.savePreset}>Save</button>
        </div>

        if (this.state.showDetails == false) {
            return (
                <div className="fundingCalls">

                    <Tags
                        tagifyRef={this.state.tagifyRef} // optional Ref object for the Tagify instance itself, to get access to inner-methods
                        settings={this.state.settings}
                        {...this.state.tagifyProps}   // dynamic props such as "loading", "showDropdown:'abc'", "value"
                        onChange={this.onChange}
                    />
                    <button id="save" title="Save Tag Preset" onClick={this.showPresetTitleInput}>+</button>

                    {this.state.showTitleInput && tagTitleInput}

                    <select value={this.state.selectValue} onChange={this.chooseTagPreset} required="required">
                        <option value={"placeholder"} disabled hidden>Choose a saved search...</option>
                        <option value={"[]"} >None</option>
                        {tagPresetsOptions}
                    </select>

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
            const opp = this.state.selectedItem;
    
            return (
                <div className="fundingCalls">
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
                        {(this.props.user.role === "researcher") && 
                            <button type="button" onClick={this.handleSubmit}>Add to shortlist</button>
                        }
                        {(this.props.user.role !== "researcher") && 
                            <button type="button" id="remove" onClick={this.handleRemove}>Remove from funding calls</button>
                        }
                        <a id="share" class="secondary-btn" onClick={(e) => window.open(this.mailtoLink())} target="_blank">Share by email</a>
                    </div>
                </div>
            )
        }
    }

    getItems(i) {
        this.itemService.retrieveOpportunities(i).then(opps => {
            this.setState({ items: opps });
        }
        );
    }

    getPages() {
        this.itemService.retrieveOpportunitiesPages().then(pages => {
            this.setState({ pages: pages, originalPages: pages });
        }
        );
    }

    getTagPresets() {
        this.itemService.retrieveTagPresets(this.props.user._links.tagPresets.href).then(presets => {
            this.setState({ tagPresets: presets });
        }
        );
    }

    showPresetTitleInput = async (e) => {
        e.preventDefault();
        this.setState({showTitleInput: true});
    }

    tagPresetTitleChange = (e) => {
        e.preventDefault();

        let value = e.target.value;
        this.setState({ tagPresetTitle: value});
    }

    savePreset = async (e) => {
        e.preventDefault();
        console.log("submit");
        
        let requestBody = {
            "title": this.state.tagPresetTitle,
            "user": this.props.user._links.self.href,
            "tags": this.state.tags
        };
        console.log(requestBody);
        let response = await this.itemService.createTagPreset(requestBody);
        console.log("Response: " + JSON.stringify(response));
        this.setState({tagPresets: [...this.state.tagPresets, response], showTitleInput: false, tagPresetTitle: ""});
    }

    onSelect(itemLink) {
        this.clearState();
        this.itemService.getItem(itemLink).then(item => {
            this.setState({
                showDetails: true,
                selectedItem: item
            });
        }
        );
    }

    backToOpportunities = async (e) => {
        e.preventDefault();
        this.setState({showDetails: false});
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let shortlistRequest = {
            "user": this.props.user._links.self.href,
            "opportunity": this.state.selectedItem._links.self.href,
            "urls": "[]",
            "status": "shortlisted"
        }
        console.log("shortlistRequest: " + JSON.stringify(shortlistRequest));
        this.itemService.createShortlistItem(shortlistRequest);
        this.props.changeTab(2);

    }

    handleRemove = async (e) => {
        e.preventDefault();
        this.setState({showDetails: false, pageNo: 0});
        let response = await this.itemService.removeOpportunity(this.state.selectedItem._links.self.href);
        console.log("Remove response: " + JSON.stringify(response));
    }

    urlClick(item) {
        this.setState({
            showDetails: true,
            selectedItem: item
        });
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

    handlePageClick = (data) => {
        let selected = data.selected;
        this.getItems(selected);
        if (this.state.taggedItems.length > 0) {
            this.setState({items: this.state.taggedItems.slice(selected*5,selected*5 + 5)});
        }
        this.setState({pageNo: selected});
    };

    updateOpportunities(values) {
        if (values === "") {
            this.getItems(0);
            this.setState({pages: this.state.originalPages, taggedItems: []});
        } else {
            var tagArr = JSON.parse(values).map(item => item.value);
            this.itemService.retrieveTaggedOpportunities(tagArr).then(opps => {
                this.setState({ taggedItems: opps, items: opps.slice(0,5), pages: Math.ceil(opps.length/5) });
            }
            );
        }
    }

    onChange = (e) => {
        e.persist();
        console.log(e);
        console.log(e.target);
        
        console.log("CHANGED:", e.target.value);
        this.updateOpportunities(e.target.value);
        let tagArr = [];
        if (e.target.value.length > 0) {
            tagArr = JSON.parse(e.target.value).map(item => item.value);
        }

        this.setState({ tags: tagArr, pageNo: 0, selectValue:"placeholder"})
    }

    chooseTagPreset = (e) => {
        e.persist();
        var parsedTags = JSON.parse(e.target.value);
        console.log("CHANGED:", parsedTags);
        this.state.tagifyRef.current.removeAllTags();
        let dummyTagifyProps = this.state.tagifyProps;
        dummyTagifyProps.value = parsedTags;
        this.setState({
            tagifyProps: dummyTagifyProps,
            tags: parsedTags,
            selectValue: e.target.value
        })
    }

    mailtoLink() {
        let opp = this.state.selectedItem;
        let dates = JSON.parse(opp.dates).map((date) => date.title + ": " + date.date);

        let subjectStr = "Funding Opportunity: " + opp.title;
        let bodyStr =   "I came across a funding opportunity that I thought you might like to see!%0A%0A" +
                        opp.title + " %0A%0A" +
                        opp.description + " %0A%0A" +
                        opp.fundingDescription + " %0A%0A" +
                        dates.join(" %0A") + " %0A%0A" +
                        "Read more at " + opp.url + " %0A%0A" +
                        "Shared from Idea to Grant browser extension";
        console.log( "mailto:?body=" + bodyStr.replace(/ /g, '%20') + "&subject=" + subjectStr.replace(/ /g, '%20'));
        return "mailto:?body=" + bodyStr.replace(/ /g, '%20') + "&subject=" + subjectStr.replace(/ /g, '%20');
    }
}

export default FundingCalls
