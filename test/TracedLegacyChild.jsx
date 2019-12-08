/* eslint react/no-deprecated: 0 */
import React, { Component } from 'react';
import { traceLifecycle } from '../src';

class LegacyChild extends Component {
  state = {}

  constructor(props, context) {
    super(props, context);
    props.trace('custom:constructor');
  }

  componentWillMount() {
    this.props.trace('custom:componentWillMount');
  }

  componentWillReceiveProps() {
    this.props.trace('custom:componentWillReceiveProps');
  }

  shouldComponentUpdate() {
    this.props.trace('custom:shouldComponentUpdate');
    return true;
  }

  componentWillUpdate() {
    this.props.trace('custom:componentWillUpdate');
  }

  render() {
    this.props.trace('custom:render');
    return <this.props.LifecyclePanel/>;
  }

  componentDidMount() {
    this.props.trace('custom:componentDidMount');
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

const TracedLegacyChild = traceLifecycle(LegacyChild);

export default TracedLegacyChild;
