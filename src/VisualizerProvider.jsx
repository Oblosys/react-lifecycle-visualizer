import * as React from 'react';
import { createProvider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import * as constants from './constants';
import { reducer } from './reducer';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Provider = createProvider(constants.reduxStoreKey);

const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(thunk))
);

const VisualizerProvider = ({children}) => (
  <Provider store={store}>{children}</Provider>
);

export default VisualizerProvider;
