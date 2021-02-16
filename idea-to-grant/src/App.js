import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './App.css';
import CurrentPage from './CurrentPage';
import FundingCalls from './FundingCalls';
import Shortlist from './Shortlist';
{/*import Navigation from './Navigation';*/ }

class App extends Component {
  constructor(props) {
    super(props);
    this.setTabIndex = this.setTabIndex.bind(this);
    this.setCurrentPageTitle = this.setCurrentPageTitle.bind(this);
    this.setCurrentPageUrl = this.setCurrentPageUrl.bind(this);
    this.setCurrentPageDate = this.setCurrentPageDate.bind(this);
    this.setCurrentPageDescription = this.setCurrentPageDescription.bind(this);
    this.setCurrentPageTags = this.setCurrentPageTags.bind(this);
    this.state = {
      tabIndex: 0,
      currentPageObject: {
        title: "",
        url: "",
        date: "",
        description: "",
        tags: []
      }
    }
  }

  render() {
    const tabIndex = this.state.tabIndex;

    return (
    <div className="app">
      {/*<h1>Idea to <span id="app__logobold">Grant</span></h1>*/}
      <div className="app__body">
        {/* <Navigation /> */}
        {/* Content */}
        {/* <CurrentPage /> */}

        <Tabs selectedIndex={tabIndex} onSelect={index => this.setTabIndex(index)}>
          <TabList>
            <Tab>Current Page</Tab>
            <Tab>Funding Calls</Tab>
            <Tab>Shortlist</Tab>
            <Tab>My Projects</Tab>
          </TabList>

          <TabPanel>
            <CurrentPage changeTab={index => this.setTabIndex(index)} currentPageObject={this.state.currentPageObject}
            setTitle={title => this.setCurrentPageTitle(title)} setUrl={url =>  this.setCurrentPageUrl(url)}
            setDate={date =>  this.setCurrentPageDate(date)} setDescription={description =>  this.setCurrentPageDescription(description)}
            setTags={tags =>  this.setCurrentPageTags(tags)}/>
          </TabPanel>
          <TabPanel>
            <FundingCalls changeTab={index => this.setTabIndex(index)} currentPageObject={this.state.currentPageObject}
            setTitle={title => this.setCurrentPageTitle(title)} setUrl={url =>  this.setCurrentPageUrl(url)}
            setDate={date =>  this.setCurrentPageDate(date)} setDescription={description =>  this.setCurrentPageDescription(description)}
            setTags={tags =>  this.setCurrentPageTags(tags)}/>
          </TabPanel>
          <TabPanel>
            <Shortlist changeTab={index => this.setTabIndex(index)}/>
          </TabPanel>
          <TabPanel>
            <Shortlist changeTab={index => this.setTabIndex(index)}/>
          </TabPanel>
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

  setCurrentPageDate(date) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.date = date;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageDescription(description) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.description = description;
    this.setState({currentPageObject: currentPageObject});
  }

  setCurrentPageTags(tags) {
    var currentPageObject = this.state.currentPageObject;
    currentPageObject.tags = tags;
    this.setState({currentPageObject: currentPageObject});
  }
}



export default App;
