import React, { Component } from 'react';
import { traceLifecycle } from '../src';

class Child extends Component {
  state = {}

  static staticProperty = 'a static property'

  constructor(props, context) {
    super(props, context);
    props.trace('custom:constructor');
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromProps(nextProps, prevState) {
    nextProps.trace('custom:getDerivedStateFromProps');
    return null;
  }

  shouldComponentUpdate() {
    this.props.trace('custom:shouldComponentUpdate');
    return true;
  }

  render() {
    this.props.trace('custom:render');
    return <this.props.LifecyclePanel/>;
  }

  componentDidMount() {
    this.props.trace('custom:componentDidMount');
  }

  getSnapshotBeforeUpdate() {
    this.props.trace('custom:getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate() {
    this.props.trace('custom:componentDidUpdate');
  }

  componentWillUnmount() {
    this.props.trace('custom:componentWillUnmount');
  }

  updateState = () => {
    this.setState(() => {
      this.props.trace('custom:setState update fn');
      return {};
    }, () => {
      this.props.trace('custom:setState callback');
    });
  }
}

const TracedChild = traceLifecycle(Child);

export default TracedChild;
