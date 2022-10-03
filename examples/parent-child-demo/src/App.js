import React from 'react';
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

export default App;
