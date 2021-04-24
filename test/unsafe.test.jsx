/* eslint camelcase: 0, max-classes-per-file: 0, lines-between-class-members: 0, react/no-deprecated: 0 */
import React, { Component } from 'react';
import { render } from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';

import { traceLifecycle } from '../src';

// React Testing Library discourages tests on instances, but these test are extremely tedious to express without them,
// as there is no observable difference between the legacy methods and their UNSAFE_ counterparts.

// Return the TracedComponent instance for traceLifecycle(Comp).
const getTracedComponentInstance = (Comp) => {
  let tracingComponentInstance; // Need TracingComponent instance as root for ReactTestUtils.findAllInRenderedTree().
  const TracingComp = traceLifecycle(Comp);
  class SpyComp extends TracingComp {
    constructor(props, context) {
      super(props, context);
      tracingComponentInstance = this;
    }
  }

  /* eslint-disable no-console */
  // Disable console.warn to suppress React warnings about using legacy methods (emitted once per method).
  const consoleWarn = console.warn;
  console.warn = () => {};
  render(<SpyComp/>);
  console.warn = consoleWarn;
  /* eslint-enable no-console */

  const [tracedInstance] =
    ReactTestUtils.findAllInRenderedTree(tracingComponentInstance, (c) => c.constructor.name === 'TracedComponent');
  return tracedInstance;
};

describe('unsafe', () => {
  it('Traces old methods if only old methods are defined', () => {
    class Comp extends Component {
      componentWillMount() {}
      componentWillReceiveProps() {}
      componentWillUpdate() {}
      render() {
        return '';
      }
    }

    const tracedInstance = getTracedComponentInstance(Comp);
    expect(tracedInstance).toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('componentWillUpdate');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillUpdate');
  });

  it('Traces UNSAFE_ methods if only UNSAFE_ methods are defined', () => {
    class Comp extends Component {
      UNSAFE_componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      UNSAFE_componentWillUpdate() {}
      render() {
        return '';
      }
    }

    const tracedInstance = getTracedComponentInstance(Comp);
    expect(tracedInstance).not.toHaveProperty('componentWillMount');
    expect(tracedInstance).not.toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });

  it('Traces UNSAFE_ methods if neither old nor UNSAFE_ methods are defined (1)', () => {
    // Need two tests, since we need to define at least one UNSAFE_ method to turn it into a legacy component.
    class Comp extends Component {
      UNSAFE_componentWillMount() {}
      render() {
        return '';
      }
    }

    const tracedInstance = getTracedComponentInstance(Comp);
    expect(tracedInstance).not.toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });

  it('Traces UNSAFE_ methods if neither old nor UNSAFE_ methods are defined (2)', () => {
    class Comp extends Component {
      UNSAFE_componentWillReceiveProps() {}
      render() {
        return '';
      }
    }

    const tracedInstance = getTracedComponentInstance(Comp);
    expect(tracedInstance).not.toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
  });

  it('Traces both old and UNSAFE_ methods if both are defined', () => {
    // Kind of silly, but this is allowed by React.
    class Comp extends Component {
      UNSAFE_componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      UNSAFE_componentWillUpdate() {}
      componentWillMount() {}
      componentWillReceiveProps() {}
      componentWillUpdate() {}
      render() {
        return '';
      }
    }

    const tracedInstance = getTracedComponentInstance(Comp);
    expect(tracedInstance).toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });
});
