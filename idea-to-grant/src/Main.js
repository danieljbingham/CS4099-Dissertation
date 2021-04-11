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
    this.state = {
      tabIndex: 0,
      tags: []
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

    // cache shortlist
    this.getShortlistPages();
  }

  render() {
    const tabIndex = this.state.tabIndex;

    return (
    <div className="main">
      <div className="main__body">

        <Tabs selectedIndex={tabIndex} onSelect={index => this.setTabIndex(index)}>
          <TabList>
            <Tab>Add Opportunity</Tab>
            <Tab>Funding Calls</Tab>
            {(this.props.user.role === "researcher") && 
            <Tab>Shortlist</Tab>}
          </TabList>

          <TabPanel>
            <AddOpportunity changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
            tags={this.state.tags} recacheOppPages={this.recacheOppPages} recacheShortlistPages={this.recacheShortlistPages}/>
          </TabPanel>
          <TabPanel>
            <FundingCalls changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
            tags={this.state.tags} pages={this.state.oppPages}/>
          </TabPanel>
          {(this.props.user.role === "researcher") && 
            <TabPanel>
              <Shortlist changeTab={index => this.setTabIndex(index)} user={this.props.user} accessToken={this.props.accessToken}
              pages={this.state.shortlistPages}/>
            </TabPanel>
          }

        </Tabs>

      </div>
    </div>
    );
  }

  setTabIndex(index) {
    this.setState({tabIndex: index});
  }

  getTags() {
    this.itemService.retrieveTags().then(tags => {
        this.setState({
            tags: tags
        })
        console.log(tags);
    }
    );
  }

  getOppPages() {
    this.itemService.retrieveOpportunitiesPages().then(pages => {
        this.setState({ oppPages: pages, });
    }
    );
  }

  getShortlistPages() {
    this.itemService.retrieveShortlistPages(this.props.user._links.self.href).then(pages => {
        this.setState({ shortlistPages: pages});
    }
    );
  }

  recacheOppPages() {
    this.getOppPages();
  }

  recacheShortlistPages() {
    this.getShortlistPages();
  }
}



export default Main;
