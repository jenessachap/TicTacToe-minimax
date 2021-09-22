import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Router from './components/Router';
// needed this import to stop the regenerator runtime error and because babel polyfill is deprecated
import 'regenerator-runtime/runtime';

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);
