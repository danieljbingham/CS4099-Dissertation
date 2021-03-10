import React, { Component, useRef, useState } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import './FundingCalls.css'


class FundingCalls extends Component {

    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.urlClick = this.urlClick.bind(this);
        this.state = {
            items: [],
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
                    maxItems: 20,           // <- mixumum allowed rendered suggestions
                    enabled: 0,             // <- show suggestions on focus
                    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                },
                placeholder:"Type some tags..."
            }
        }
    }

    componentDidMount() {
        this.getItems();
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
            <input type="text" value={this.props.tagPresetTitle} onChange={this.tagPresetTitleChange} title="title" placeholder="Title of your saved search..."/>
            <button id="saveTitle" title="Save Tag Preset" onClick={this.savePreset}>Save</button>
        </div>
        /*const onChange = e => {
            //e.persist();
            console.log("CHANGED:", e.target.value);
            this.updateOpportunities(e.target.value);
          };
        */
        console.log(tagPresetsOptions);

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

                    <select onChange={this.chooseTagPreset} required="required">
                        <option selected disabled hidden>Choose a saved search...</option>
                        <option value={"[]"} >None</option>
                        {tagPresetsOptions}
                    </select>

                    {listItems}

                    {/*@TODO pagination*/}

                </div>
            )
        } else {
            const opp = this.state.selectedItem;
    
            return (
                <div className="fundingCalls">
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
                        <button type="button" onClick={this.handleSubmit}>Add to shortlist</button>
                    </div>
                </div>
            )
        }
    }

    getItems() {
        this.itemService.retrieveOpportunities().then(opps => {
            this.setState({ items: opps });
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
            "urls": "[]"
        }
        console.log("shortlistRequest: " + JSON.stringify(shortlistRequest));
        this.itemService.createShortlistItem(shortlistRequest);
        this.props.changeTab(2);

    }

    urlClick(item) {
        this.setState({
            showDetails: true,
            selectedItem: item
        });
    }

    /*
    urlClick(title, url, dates, description, fundingDesc, fullEcon, tags) {
        this.props.setTitle(title);
        this.props.setUrl(url);
        this.props.setDates(dates);
        this.props.setDescription(description);
        this.props.setFundingDesc(fundingDesc);
        this.props.setFullEcon(fullEcon);
        this.props.setTags(tags);
        this.props.changeTab(0);
    }*/

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

    updateOpportunities(values) {
        if (values === "") {
            this.getItems();
        } else {
            var tagArr = JSON.parse(values).map(item => item.value);
            this.itemService.retrieveTaggedOpportunities(tagArr).then(opps => {
                this.setState({ items: opps });
            }
            );
        }
    }

    onChange = (e) => {
        e.persist();
        console.log("CHANGED:", e.target.value);
        this.updateOpportunities(e.target.value);
        var tagArr = JSON.parse(e.target.value).map(item => item.value);
        this.setState({ tags: tagArr})
    }

    chooseTagPreset = (e) => {
        e.persist();
        var parsedTags = JSON.parse(e.target.value);
        console.log("CHANGED:", parsedTags);
        this.state.tagifyRef.current.removeAllTags();
        this.state.tagifyRef.current.addTags(parsedTags, true, true);
        this.setState({ tags: parsedTags })
    }
}

export default FundingCalls
