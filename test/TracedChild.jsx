import React, { Component } from 'react';
import { traceLifecycle } from '../src';

class Child extends Component {
  static getDerivedStateFromProps(nextProps, prevState, trace) {
    trace('custom:getDerivedStateFromProps');
    return null;
  }

  componentDidMount() {
    this.trace('custom:componentDidMount');
  }

  render() {
    this.trace('custom:render');
    return <this.LifecyclePanel/>;
  }
}

const TracedChild = traceLifecycle(Child);

export default TracedChild;
