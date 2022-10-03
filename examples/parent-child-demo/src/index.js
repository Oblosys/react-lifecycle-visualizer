/* global document:false */
import React from 'react';
import ReactDom from 'react-dom';
import { VisualizerProvider } from 'react-lifecycle-visualizer';

import App from './App';

ReactDom.render(
  <VisualizerProvider>
    <App/>
  </VisualizerProvider>,
  document.getElementById('root')
);
