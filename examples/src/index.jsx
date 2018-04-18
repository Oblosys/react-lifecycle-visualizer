import * as React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import '../../src/style.scss';
import { reducer } from '../../src/reducer';
import Main from './Main';
import Log from '../../src/Log';
import { clearInstanceIdCounters } from '../../src/traceLifecycle';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(thunk))
);
clearInstanceIdCounters(); // clear instance counters on Stackblitz hot reload

const App = () => (
  <div className='app'>
    <Main/>
    <Log/>
  </div>
);

ReactDom.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
