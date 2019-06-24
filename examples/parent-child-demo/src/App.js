import React from 'react';
import { hot } from 'react-hot-loader/root';
import { resetInstanceIdCounters, Log } from 'react-lifecycle-visualizer';

import './style.scss';
import Main from './Main';

resetInstanceIdCounters(); // clear instance counters on hot reload

const App = () => (
  <div className='app'>
    <Main/>
    <Log/>
  </div>
);

const isOnStackBlitz = module && module.id.match(/https:\/\/.+\.github\.stackblitz\.io\//);

// StackBlitz already does hot reloading, and setting it up here again causes errors, so we disable it.
export default  isOnStackBlitz ? App : hot(App);
