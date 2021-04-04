import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './Main.css';
import CurrentPage from './CurrentPage';
import FundingCalls from './FundingCalls';
import Shortlist from './Shortlist';
{/*import Navigation from './Navigation';*/ }

class Main extends Component {
  constructor(props) {
    super(props);
    this.setTabIndex = this.setTabIndex.bind(this);
    this.setCurrentPageTitle = this.setCurrentPageTitle.bind(this);
    this.setCurrentPageUrl = this.setCurrentPageUrl.bind(this);
    this.setCurrentPageDates = this.setCurrentPageDates.bind(this);
    this.setCurrentPageDescription = this.setCurrentPageDescription.bind(this);
    this.setCurrentPageFullEcon = this.setCurrentPageFullEcon.bind(this);
    this.setCurrentPageFundingDesc = this.setCurrentPageFundingDesc.bind(this);
    this.setCurrentPageTags = this.setCurrentPageTags.bind(this);
    this.state = {
      tabIndex: 0,
      currentPageObject: {
        title: "",
        url: "",
        dates: [{title:"", date:""}],
        description: "",
        fullEcon: false,
        fundingDesc: "",
        tags: []
      }
    }
  }

  render() {
    const tabIndex = this.state.tabIndex;

    return (
    <div className="main">
      {/*<h1>Idea to <span id="app__logobold">Grant</span></h1>*/}
      <div className="main__body">
        {/* <Navigation /> */}
        {/* Content */}
        {/* <CurrentPage /> */}

        <Tabs selectedIndex={tabIndex} onSelect={index => this.setTabIndex(index)}>
          <TabList>
            <Tab>Add Opportunity</Tab>
            <Tab>Funding Calls</Tab>
            {(this.props.user.role === "researcher") && 
            <Tab>Shortlist</Tab>}
            {/*<Tab>My Projects</Tab>*/}
          </TabList>

          <TabPanel>
            <CurrentPage changeTab={index => this.setTabIndex(index)} currentPageObject={this.state.currentPageObject}
            setTitle={title => this.setCurrentPageTitle(title)} setUrl={url =>  this.setCurrentPageUrl(url)}
            setDates={dates =>  this.setCurrentPageDates(dates)} setDescription={description =>  this.setCurrentPageDescription(description)}
            setFullEcon={econ =>  this.setCurrentPageFullEcon(econ)} setFundingDesc={fundingDesc =>  this.setCurrentPageFundingDesc(fundingDesc)}
            setTags={tags =>  this.setCurrentPageTags(tags)} user={this.props.user}/>
          </TabPanel>
          <TabPanel>
            <FundingCalls changeTab={index => this.setTabIndex(index)} currentPageObject={this.state.currentPageObject}
            setTitle={title => this.setCurrentPageTitle(title)} setUrl={url =>  this.setCurrentPageUrl(url)}
            setDates={dates =>  this.setCurrentPageDates(dates)} setDescription={description =>  this.setCurrentPageDescription(description)}
            setFullEcon={econ =>  this.setCurrentPageFullEcon(econ)} setFundingDesc={fundingDesc =>  this.setCurrentPageFundingDesc(fundingDesc)}
            setTags={tags =>  this.setCurrentPageTags(tags)} user={this.props.user}/>
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

  setCurrentPageTitle(title) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.title = title;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageUrl(url) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.url = url;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageDates(dates) {
    var currentPageObject = this.state.currentPageObject;
    if (typeof dates === 'string') {
      dates = JSON.parse(dates);
    }
    currentPageObject.dates = dates;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageDescription(description) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.description = description;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageFullEcon(fullEcon) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.fullEcon = fullEcon;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageFundingDesc(fundingDesc) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.fundingDesc = fundingDesc;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageTags(tags) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.tags = tags;
    this.setState({currentPageObject: currentPageObject});
  }
}



export default Main;
