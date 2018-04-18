import * as React from 'react';
import { Component, PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import './style.scss';
import { reducer } from './reducer';
import * as ActionCreators from './actionCreators';
import Main from './Main';
import Log from './Log';
import { clearInstanceIdCounters } from './traceLifecycle';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(thunk))
);
clearInstanceIdCounters(); // clear instance counters on Stackblitz hot reload

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Main/>
        <Log/>
      </div>
    );
  }
}

ReactDom.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
