import React, { Component } from 'react';
import { traceLifecycle } from '../src';

class Child extends Component {
  state = {}

  // eslint-disable-next-line no-useless-constructor
  constructor(props, context) {
    super(props, context);
  }

  static getDerivedStateFromProps(nextProps, prevState, trace) {
    trace('custom:getDerivedStateFromProps');
    return null;
  }

  shouldComponentUpdate() {
    this.trace('custom:shouldComponentUpdate');
    return true;
  }

  render() {
    this.trace('custom:render');
    return <this.LifecyclePanel/>;
  }

  componentDidMount() {
    this.trace('custom:componentDidMount');
  }

  getSnapshotBeforeUpdate() {
    this.trace('custom:getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate() {
    this.trace('custom:componentDidUpdate');
  }

  componentWillUnmount() {
    this.trace('custom:componentWillUnmount');
  }

  updateState = () => {
    this.setState(() => {
      this.trace('custom:setState update fn');
      return {};
    }, () => {
      this.trace('custom:setState callback');
    });
  }
}

const TracedChild = traceLifecycle(Child);

export default TracedChild;
