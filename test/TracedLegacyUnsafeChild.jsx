/* eslint camelcase: 0 */
import { Component } from 'react';
import { traceLifecycle } from '../src';

class LegacyUnsafeChild extends Component {
  UNSAFE_componentWillMount() {
    this.props.trace('custom:UNSAFE_componentWillMount');
  }

  UNSAFE_componentWillReceiveProps() {
    this.props.trace('custom:UNSAFE_componentWillReceiveProps');
  }

  UNSAFE_componentWillUpdate() {
    this.props.trace('custom:UNSAFE_componentWillUpdate');
  }

  render() {
    return '';
  }
}

const TracedLegacyUnsafeChild = traceLifecycle(LegacyUnsafeChild);

export default TracedLegacyUnsafeChild;
