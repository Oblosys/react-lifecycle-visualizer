import * as React from 'react';
import { hot } from 'react-hot-loader';
import { clearInstanceIdCounters, Log } from '../../src';

import './style.scss';
import Main from './Main';

clearInstanceIdCounters(); // clear instance counters on hot reload

const App = () => (
  <div className='app'>
    <Main/>
    <Log/>
  </div>
);

export default hot(module)(App);
