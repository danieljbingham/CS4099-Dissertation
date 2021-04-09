import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './Main.css';
import AddOpportunity from './AddOpportunity';
import FundingCalls from './FundingCalls';
import Shortlist from './Shortlist';
{/*import Navigation from './Navigation';*/ }

class Main extends Component {
  constructor(props) {
    super(props);
    this.setTabIndex = this.setTabIndex.bind(this);
    this.state = {
      tabIndex: 0,
    }
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
            <AddOpportunity changeTab={index => this.setTabIndex(index)} user={this.props.user}/>
          </TabPanel>
          <TabPanel>
            <FundingCalls changeTab={index => this.setTabIndex(index)} user={this.props.user}/>
          </TabPanel>
          {(this.props.user.role === "researcher") && 
            <TabPanel>
              <Shortlist changeTab={index => this.setTabIndex(index)} user={this.props.user}/>
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

  setAddOpportunityTitle(title) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.title = title;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityUrl(url) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.url = url;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityDates(dates) {
    var addOpportunityObject = this.state.addOpportunityObject;
    if (typeof dates === 'string') {
      dates = JSON.parse(dates);
    }
    addOpportunityObject.dates = dates;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityDescription(description) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.description = description;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityFullEcon(fullEcon) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.fullEcon = fullEcon;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityFundingDesc(fundingDesc) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.fundingDesc = fundingDesc;
    this.setState({addOpportunityObject: addOpportunityObject});
  }

  setAddOpportunityTags(tags) {
    var addOpportunityObject = this.state.addOpportunityObject;
    addOpportunityObject.tags = tags;
    this.setState({addOpportunityObject: addOpportunityObject});
  }
}



export default Main;
