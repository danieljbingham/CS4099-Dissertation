import './App.css';
import Navigation from './Navigation';

function App() {
  return (
    <div className="app">
      <h1>Idea to <span id="app__logobold">Grant</span></h1>
      <div className="app__body">
      <Navigation />
      {/* Content */}
      </div>
    </div>
  );
}

export default App;
