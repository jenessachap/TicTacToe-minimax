import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import React from 'react';

export default function Router() {
  return (
    <BrowserRouter>
      {/* essentially a switch statement that chooses the component to render based on the path */}
      <Switch>
        <Route exact path="/" render={() => <App />} />
        <Route path="/app" render={() => <App />} />
      </Switch>
    </BrowserRouter>
  );
}
