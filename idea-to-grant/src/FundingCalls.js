import React, { Component } from 'react'
import ItemService from './item-service'
import Opportunity from './Opportunity';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file for tagify
import ReactPaginate from 'react-paginate'; // pagination
import "@yaireo/tagify/dist/tagify.css" // Tagify CSS
import './FundingCalls.css'


class FundingCalls extends Component {

    constructor(props) {
        super(props);
        this.itemService = new ItemService(this.props.accessToken);
        this.urlClick = this.urlClick.bind(this);
        this.state = {
            items: [],
            taggedItems: [],
            pages: this.props.pages,
            originalPages: this.props.pages,
            pageNo: 0,
            selectValue: "placeholder",
            tags: [],
            tagPresets: this.props.tagPresets,
            showDetails: false,
            selectedItem: {},
            confirmDeletion: false,
            showTitleInput: false,
            tagPresetTitle: "",

            titleError: "",
            tagsError: ""
        }
        this.state = {
            ...this.state,
            tagifyRef: React.createRef(),
            tagifyProps: { whitelist: this.props.tags, value: this.state.tags }
        }
    }

    // function gets called on load
    componentDidMount() {
        this.getItems(0);
    }

    // function gets called if props update
    componentDidUpdate(prevProps) {
        if (this.props.pages !== prevProps.pages) {
            this.setState({
                originalPages: this.props.pages
            })
        }

        if (this.props.tags !== prevProps.tags) {
            let dummyTagifyProps = this.state.tagifyProps;
            dummyTagifyProps.whitelist = this.props.tags;
            this.setState({
                tagifyProps: dummyTagifyProps
            })
        }

        if (this.props.tagPresets !== prevProps.tagPresets) {
            this.setState({
                tagPresets: this.props.tagPresets
            })
        }
    }

    render() {

        // map opportunities to list of Opportunity components
        const items = this.state.items;
        if (!items) return null;
        const listItems = items.map((item) =>
            <Opportunity opportunity={item} onClick={this.urlClick} />
        );

        // map tagPresets to options in dropdown box
        const tagPresets = this.state.tagPresets;
        let tagPresetsOptions = [];
        tagPresetsOptions = tagPresets.map((preset) =>
            <option value={JSON.stringify(preset.tags)}>{preset.title}</option>
        );

        // option to save a search, only shown if requested
        let tagTitleInput = <div id="tagTitle">
            <div id="tagTitleInput">
                <input type="text" value={this.state.tagPresetTitle} onChange={this.tagPresetTitleChange} title="title" placeholder="Title of your saved search..." />
                <button id="saveTitle" title="Save Tag Preset" onClick={this.savePreset}>Save</button>
            </div>
            <div id="tagTitleErrors">
                {this.state.titleError && <p className="error">{this.state.titleError}</p>}
                {this.state.tagsError && <p className="error">{this.state.tagsError}</p>}
            </div>
        </div>

        if (this.state.showDetails == false) {
            // default view for this tab, list all opportunities
            return (
                <div className="fundingCalls">

                    <div id="tagRow">
                        <Tags
                            tagifyRef={this.state.tagifyRef} // Ref object for Tagify instance to get access to inner-methods
                            settings= {{
                                dropdown: {
                                    maxItems: 12,          
                                    enabled: 0,             
                                    closeOnSelect: false
                                },
                                placeholder: "Type some tags..."
                            }}
                            {...this.state.tagifyProps}   // dynamic props
                            onChange={this.onTagsChange}
                        />
                        <button id="save" title="Save Tag Preset" onClick={this.showPresetTitleInput}>+</button>
                    </div>

                    {this.state.showTitleInput && tagTitleInput}

                    <select value={this.state.selectValue} onChange={this.chooseTagPreset} required="required">
                        <option value={"placeholder"} disabled hidden>Choose a saved search...</option>
                        <option value={"[]"} >None</option>
                        {tagPresetsOptions}
                    </select>

                    {listItems} {/* this displays the list of opportunities */}

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
                            <button type="button" className="remove" onClick={this.confirmDeletion}>Remove from funding calls</button>
                        }
                        <button id="share" class="secondary-btn" onClick={(e) => window.open(this.mailtoLink())} >Share by email</button>
                        <br />
                        {(this.props.user.role !== "researcher") && (this.state.confirmDeletion) &&
                            <button type="button" className="remove" onClick={this.handleRemove}>Confirm deletion</button>
                        }
                        {(this.props.user.role !== "researcher") && (this.state.confirmDeletion) &&
                            <button type="button" class="secondary-btn" onClick={this.cancelConfirmDeletion}>Cancel</button>
                        }
                    </div>
                </div>
            )
        }
    }

    // get ith page of opportunities from API
    getItems(i) {
        this.itemService.retrieveOpportunities(i).then(opps => {
            this.setState({ items: opps });
        }
        );
    }

    // onClick function for + button to start a saved search
    showPresetTitleInput = async (e) => {
        e.preventDefault();
        this.setState({ showTitleInput: true });
    }

    // onChange function for title of saved search
    tagPresetTitleChange = (e) => {
        e.preventDefault();

        let value = e.target.value;
        this.inputValid("title", value);
        this.setState({ tagPresetTitle: value });
    }

    // onClick function for saving a saved search
    savePreset = async (e) => {
        e.preventDefault();

        // check title and tags are valid first

        if (this.savePresetValid()) {
            let requestBody = {
                "title": this.state.tagPresetTitle,
                "user": this.props.user._links.self.href,
                "tags": this.state.tags
            };
            let response = await this.itemService.createTagPreset(requestBody);
            this.props.addTagPreset(response);
            this.setState({ showTitleInput: false, tagPresetTitle: "" });
        }
    }

    // click function for back button when viewing an opportunity
    backToOpportunities = async (e) => {
        e.preventDefault();
        this.setState({ showDetails: false, confirmDeletion: false });
    }

    // submit function for adding an opportunity to researcher's shortlist
    handleSubmit = async (e) => {
        e.preventDefault();
        let shortlistRequest = {
            "user": this.props.user._links.self.href,
            "opportunity": this.state.selectedItem._links.self.href,
            "urls": "[]",
            "checklist": "[]",
            "status": "shortlisted"
        }
        await this.itemService.createShortlistItem(shortlistRequest);
        this.props.recacheShortlistPages();
        this.props.recacheShortlist();
        this.props.changeTab(2);

    }

    // submit function for bdm removing an opportunity from system
    handleRemove = async (e) => {
        e.preventDefault();

        this.setState({ showDetails: false, pageNo: 0 });
        let response = await this.itemService.removeOpportunity(this.state.selectedItem._links.self.href);
        this.getItems(0);
    }

    // click function for viewing an opportunity in more detail
    urlClick(item) {
        this.setState({
            showDetails: true,
            selectedItem: item
        });
    }

    // click event for pagination
    handlePageClick = (data) => {
        let selected = data.selected;
        this.getItems(selected);
        if (this.state.taggedItems.length > 0) {
            // paginate tagged items manually
            this.setState({ items: this.state.taggedItems.slice(selected * 5, selected * 5 + 5) });
        }
        this.setState({ pageNo: selected });
    };

    // get opportnuities
    updateOpportunities(tags) {
        if (tags === "") {
            // empty tags so use default function for gettin opportunities
            this.getItems(0);
            this.setState({ pages: this.state.originalPages, taggedItems: [] });
        } else {
            // get opportunities from API based on tags
            let tagArr = JSON.parse(tags).map(item => item.value);
            this.itemService.retrieveTaggedOpportunities(tagArr).then(opps => {
                this.setState({ taggedItems: opps, items: opps.slice(0, 5), pages: Math.ceil(opps.length / 5) });
            }
            );
        }
    }

    // change function for tags input
    onTagsChange = (e) => {
        e.persist();

        // fetch opportunities based on tags
        this.updateOpportunities(e.target.value);

        // set state of tags array
        let tagArr = [];
        if (e.target.value.length > 0) {
            tagArr = JSON.parse(e.target.value).map(item => item.value);
        }

        this.inputValid("tags", tagArr);
        this.setState({ tags: tagArr, pageNo: 0, selectValue: "placeholder" })
    }

    // onChange function for saved search dropdown 
    chooseTagPreset = (e) => {
        e.persist();

        let parsedTags = JSON.parse(e.target.value);
        this.state.tagifyRef.current.removeAllTags(); // clear existing tags

        let dummyTagifyProps = this.state.tagifyProps;
        dummyTagifyProps.value = parsedTags; // set tags in Tagify props
        
        this.setState({
            tagifyProps: dummyTagifyProps,
            tags: parsedTags,
            selectValue: e.target.value
        })
    }

    // generate mailto link for the selected opportunity
    mailtoLink() {
        let opp = this.state.selectedItem;
        let dates = JSON.parse(opp.dates).map((date) => date.title + ": " + date.date);

        let subjectStr = "Funding Opportunity: " + opp.title;
        let bodyStr = "I came across a funding opportunity that I thought you might like to see!%0A%0A" +
            opp.title + " %0A%0A" +
            opp.description + " %0A%0A" +
            opp.fundingDescription + " %0A%0A" +
            dates.join(" %0A") + " %0A%0A" +
            "Read more at " + opp.url + " %0A%0A" +
            "Shared from Idea to Grant browser extension";
            
        return "mailto:?body=" + bodyStr.replace(/ /g, '%20') + "&subject=" + subjectStr.replace(/ /g, '%20');
    }

    // check that all inputs are valid before saving a saved search
    savePresetValid() {
        return this.inputValid("title", this.state.tagPresetTitle) &
            this.inputValid("tags", this.state.tags)
    }

    // check validity of given input
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
            case "tags":
                if (value.length < 1) {
                    this.setState({ tagsError: "You must include tags to save a preset" });
                    return false;
                } else if (this.state.tagsError) {
                    this.setState({ tagsError: "" });
                }
                break;
        }

        return true;

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

export default FundingCalls
