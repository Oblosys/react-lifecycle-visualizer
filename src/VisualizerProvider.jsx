import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { reducer } from './reducer';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(thunk))
);

const VisualizerProvider = ({children}) => (
  <Provider store={store}>{children}</Provider>
);

export default VisualizerProvider;
