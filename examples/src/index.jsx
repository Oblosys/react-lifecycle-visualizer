import React from 'react';
import ReactDom from 'react-dom';
import 'react-hot-loader';
import { VisualizerProvider } from '../../src';

import App from './App';

ReactDom.render(
  <VisualizerProvider>
    <App/>
  </VisualizerProvider>,
  document.getElementById('root')
);
