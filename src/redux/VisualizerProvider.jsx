import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import * as actionCreators from './actionCreators';
import { reducer } from './reducer';

// Context for the lifecycle-visualizer store
export const LifecycleVisualizerContext = React.createContext();

export const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export const clearLog = () => store.dispatch(actionCreators.clearLog());
// The store never changes, so we can safely export this bound function.

const VisualizerProvider = ({children}) => (
  <Provider store={store} context={LifecycleVisualizerContext}>{children}</Provider>
);

VisualizerProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default VisualizerProvider;
