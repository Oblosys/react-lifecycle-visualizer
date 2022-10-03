/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisualizerProvider } from 'react-lifecycle-visualizer';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <VisualizerProvider>
    <App/>
  </VisualizerProvider>
);
