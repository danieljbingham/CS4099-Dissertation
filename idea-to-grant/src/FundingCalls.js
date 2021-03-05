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
            <input type="text" value={this.props.tagPresetTitle} title="title" placeholder="Title of your saved search..."/>
            <button id="saveTitle" title="Save Tag Preset" onClick={this.savePreset}>Save</button>
        </div>
        /*const onChange = e => {
            //e.persist();
            console.log("CHANGED:", e.target.value);
            this.updateOpportunities(e.target.value);
          };
        */

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
                    {tagPresetsOptions}
                </select>

                {listItems}

                {/*@TODO pagination*/}

            </div>
        )
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
        //console.log("Response: " + JSON.stringify(response));
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

    urlClick(title, url, date, description, tags) {
        this.props.setTitle(title);
        this.props.setUrl(url);
        this.props.setDate(date);
        this.props.setDescription(description);
        this.props.setTags(tags);
        this.props.changeTab(0);
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

    onChange = e => (e.persist(), console.log("CHANGED:", e.target.value), this.updateOpportunities(e.target.value), this.setState({ tags: e.target.value}));

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
