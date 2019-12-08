/* eslint camelcase: 0, max-classes-per-file: 0, lines-between-class-members: 0, react/no-deprecated: 0 */
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { traceLifecycle, VisualizerProvider } from '../src';

describe('unsafe', () => {
  it('Traces old methods if only old methods are defined', () => {
    const Comp = traceLifecycle(class Unsafe extends Component {
      componentWillMount() {}
      componentWillReceiveProps() {}
      componentWillUpdate() {}
      render() {
        return '';
      }
    });

    const tracedInstance = mount(<VisualizerProvider><Comp/></VisualizerProvider>).find('Unsafe').instance();
    expect(tracedInstance).toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('componentWillUpdate');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('UNSAFE_componentWillUpdate');
  });

  it('Traces UNSAFE_ methods if only UNSAFE_ methods are defined', () => {
    const Comp = traceLifecycle(class Unsafe extends Component {
      UNSAFE_componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      UNSAFE_componentWillUpdate() {}
      render() {
        return '';
      }
    });

    const tracedInstance = mount(<VisualizerProvider><Comp/></VisualizerProvider>).find('Unsafe').instance();
    expect(tracedInstance).not.toHaveProperty('componentWillMount');
    expect(tracedInstance).not.toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });


  it('Traces UNSAFE_ methods if neither old nor UNSAFE_ methods are defined (1)', () => {
    // Need two tests, since we need to define at least one UNSAFE_ method to turn it into a legacy component.
    const Comp = traceLifecycle(class Unsafe extends Component {
      UNSAFE_componentWillMount() {}
      render() {
        return '';
      }
    });
    const tracedInstance = mount(<VisualizerProvider><Comp/></VisualizerProvider>).find('Unsafe').instance();
    expect(tracedInstance).not.toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).not.toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });

  it('Traces UNSAFE_ methods if neither old nor UNSAFE_ methods are defined (2)', () => {
    const Comp = traceLifecycle(class Unsafe extends Component {
      UNSAFE_componentWillReceiveProps() {}
      render() {
        return '';
      }
    });
    const tracedInstance = mount(<VisualizerProvider><Comp/></VisualizerProvider>).find('Unsafe').instance();
    expect(tracedInstance).not.toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
  });

  it('Traces both old and UNSAFE_ methods if both are defined', () => {
    // Kind of silly, but this is allwed by React.
    const Comp = traceLifecycle(class Unsafe extends Component {
      UNSAFE_componentWillMount() {}
      UNSAFE_componentWillReceiveProps() {}
      UNSAFE_componentWillUpdate() {}
      componentWillMount() {}
      componentWillReceiveProps() {}
      componentWillUpdate() {}
      render() {
        return '';
      }
    });

    const tracedInstance = mount(<VisualizerProvider><Comp/></VisualizerProvider>).find('Unsafe').instance();
    expect(tracedInstance).toHaveProperty('componentWillMount');
    expect(tracedInstance).toHaveProperty('componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('componentWillUpdate');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillMount');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillReceiveProps');
    expect(tracedInstance).toHaveProperty('UNSAFE_componentWillUpdate');
  });
});
