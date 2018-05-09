import React, { Component } from 'react';
import { traceLifecycle } from '../src';

class LegacyChild extends Component {
  componentWillMount() {
  }

  render() {
    return <this.LifecyclePanel/>;
  }
}

const TracedLegacyChild = traceLifecycle(LegacyChild);

export default TracedLegacyChild;
