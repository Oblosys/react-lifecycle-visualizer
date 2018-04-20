import React from 'react';
import { hot } from 'react-hot-loader';
import { clearInstanceIdCounters, Log } from 'react-lifecycle-visualizer';

import './style.scss';
import Main from './Main';

clearInstanceIdCounters(); // clear instance counters on hot reload

const App = () => (
  <div className='app'>
    <Main/>
    <Log/>
  </div>
);

// Don't set up hot reloading on StackBlitz (where `module` is not defined.)
export default typeof module === 'undefined' ? App : hot(module)(App);
