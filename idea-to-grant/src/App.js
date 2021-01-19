import CurrentPage from './CurrentPage';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './App.css';
import FundingCalls from './FundingCalls';
{/*import Navigation from './Navigation';*/ }

function App() {
  return (
    <div className="app">
      {/*<h1>Idea to <span id="app__logobold">Grant</span></h1>*/}
      <div className="app__body">
        {/* <Navigation /> */}
        {/* Content */}
        {/* <CurrentPage /> */}

        <Tabs>
          <TabList>
            <Tab>Current Page</Tab>
            <Tab>Funding Calls</Tab>
            <Tab>Shortlist</Tab>
            <Tab>My Projects</Tab>
          </TabList>

          <TabPanel>
            <CurrentPage />
          </TabPanel>
          <TabPanel>
            <FundingCalls />
          </TabPanel>
          <TabPanel>
            <CurrentPage />
          </TabPanel>
          <TabPanel>
            <CurrentPage />
          </TabPanel>
        </Tabs>

      </div>
    </div>
  );
}

export default App;
