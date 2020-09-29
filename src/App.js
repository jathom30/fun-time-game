import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PositionContextProvider } from './PositionContext';
import { BoardRoute, HowTo, Home, Settings } from './routes'

const App = () => {
  return (
    <div className="App">
      <Router>
        <PositionContextProvider>
          <Route exact path="/">
            <Home />
          </Route> 
          <Route path="/board">
            <BoardRoute />
          </Route>
          <Route path="/how-to">
            <HowTo />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
        </PositionContextProvider>
      </Router>
    </div>
  );
}

export default App;
