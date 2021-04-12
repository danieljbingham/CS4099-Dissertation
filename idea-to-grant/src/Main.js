import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './Main.css';
import AddOpportunity from './AddOpportunity';
import FundingCalls from './FundingCalls';
import Shortlist from './Shortlist';
import ItemService from './item-service'

class Main extends Component {
  constructor(props) {
    super(props);
    this.itemService = new ItemService(this.props.accessToken);
    this.setTabIndex = this.setTabIndex.bind(this);
    this.recacheOppPages = this.recacheOppPages.bind(this);
    this.recacheShortlistPages = this.recacheShortlistPages.bind(this);
    this.recacheShortlist = this.recacheShortlist.bind(this);
    this.addTagPreset = this.addTagPreset.bind(this);
    this.getShortlistOpportunity = this.getShortlistOpportunity.bind(this);
    this.state = {
      tabIndex: 0,
      tags: [],
      oppPages: 0,
      shortlistPages: 0,
      shortlist: [],
      shortlistOpportunities: {},
      tagPresets: [],
    }
  }

  componentDidMount() {
    // setup caching

    // cache tags
    this.getTags();

    // cache funding opps page numbers
    this.getOppPages();

    // cache opps pg 1


    // cache tag preset
    this.getTagPresets();

    // cache shortlist pages
    this.getShortlistPages();

    // cache shortlist
    this.getShortlistItems();
  }

  render() {
    const tabIndex = this.state.tabIndex;

    return (
      <div className="main">
        <div className="main__body">

          {/* Setup list of tabs, only show shortlist to researchers*/}
          <Tabs selectedIndex={tabIndex} onSelect={index => this.setTabIndex(index)}>
            <TabList>
              <Tab>Add Opportunity</Tab>
              <Tab>Funding Calls</Tab>
              {(this.props.user.role === "researcher") &&
                <Tab>Shortlist</Tab>}
            </TabList>

            {/* Setup content of each tab, i.e. the component for each tab
                Pass in necessary state, functions and cached data as props to each component */}
            <TabPanel>
              <AddOpportunity changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
                tags={this.state.tags} recacheOppPages={this.recacheOppPages} recacheShortlistPages={this.recacheShortlistPages} recacheShortlist={this.recacheShortlist}/>
            </TabPanel>
            <TabPanel>
              <FundingCalls changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
                tags={this.state.tags} pages={this.state.oppPages} tagPresets={this.state.tagPresets} addTagPreset={this.addTagPreset}
                recacheShortlistPages={this.recacheShortlistPages} recacheShortlist={this.recacheShortlist} />
            </TabPanel>
            {(this.props.user.role === "researcher") &&
              <TabPanel>
                <Shortlist changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
                  pages={this.state.shortlistPages} shortlist={this.state.shortlist} getShortlistOpportunity={href => this.getShortlistOpportunity(href)}
                  recacheShortlistPages={this.recacheShortlistPages} recacheShortlist={this.recacheShortlist} />
              </TabPanel>
            }

          </Tabs>

        </div>
      </div>
    );
  }

  // function to change the current tab
  setTabIndex(index) {
    this.setState({ tabIndex: index });
  }

  // get every tag used in the system, needed for tag autocomplete
  getTags() {
    this.itemService.retrieveTags().then(tags => {
      this.setState({
        tags: tags
      })
    }
    );
  }

  // get the number of pages needed to display all opportunities in the system
  // needed for pagination
  getOppPages() {
    this.itemService.retrieveOpportunitiesPages().then(pages => {
      this.setState({ oppPages: pages, });
    }
    );
  }

  // get the number of pages needed to display all opportunities in the users shortlist
  // needed for pagination
  getShortlistPages() {
    this.itemService.retrieveShortlistPages(this.props.user._links.self.href).then(pages => {
      this.setState({ shortlistPages: pages });
    }
    );
  }

  // get shortlisted items from API
  async getShortlistItems() {
    this.itemService.retrieveShortlist(this.props.user._links.self.href).then(shortlist => {
      this.setState({ shortlist: shortlist })
    }
    );
  }

  // get opportunity that pertains to shortlist
  // if opportunity has been cached, get it, otherwise make API call
  async getShortlistOpportunity(href) {
    if (href in this.state.shortlistOpportunities) {
      return this.state.shortlistOpportunities[href];
    } else {
      let item = await this.itemService.getItem(href);
      this.state.shortlistOpportunities[href] = item;
      return item;
    }
  }

  // get the user's saved searches
  getTagPresets() {
    this.itemService.retrieveTagPresets(this.props.user._links.tagPresets.href).then(presets => {
      this.setState({ tagPresets: presets });
    }
    );
  }

  // functions to allow child components to recache if needed:

  recacheOppPages() {
    this.getOppPages();
  }

  recacheShortlistPages() {
    this.getShortlistPages();
  }

  recacheShortlist() {
    this.getShortlistItems();
  }

  // this is used to add a saved search if the user creates a new one,
  // avoiding the need to recache them from the API
  addTagPreset(preset) {
    this.setState({ tagPresets: [...this.state.tagPresets, preset] });
  }
}



export default Main;
