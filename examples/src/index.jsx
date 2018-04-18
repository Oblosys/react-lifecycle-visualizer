import * as React from 'react';
import ReactDom from 'react-dom';
import { VisualizerProvider } from '../../src/index';

import App from './App';

ReactDom.render(
  <VisualizerProvider>
    <App/>
  </VisualizerProvider>,
  document.getElementById('root')
);
