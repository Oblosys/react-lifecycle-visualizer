import React, { Component } from 'react';
import { mount } from 'enzyme';

import { clearLog, Log, resetInstanceIdCounters, VisualizerProvider } from '../src';

import TracedChild from './TracedChild';
import TracedLegacyChild from './TracedLegacyChild';
import TracedLegacyUnsafeChild from './TracedLegacyUnsafeChild';

const nNewLifecyclePanelMethods = 9;  // Non-legacy panel has 9 lifecycle methods
const nLegacyLifecyclePanelMethods = 10;  // Legacy panel has 10 lifecycle methods

// Return boolean array of length `n` which is true only at index `i`.
const booleanListOnlyTrueAt = (n, i) => Array.from({length: n}, (_undefined, ix) => ix === i);

class Wrapper extends Component {
  state = {
    isShowingChild: false,             // For mounting/unmounting TracedChild
    isShowingLegacyChild: false,       // For mounting/unmounting TracedLegacyChild
    isShowingLegacyUnsafeChild: false, // For mounting/unmounting TracedLegacyUnsafeChild
    legacyProp: 0                // For updating props on TracedLegacyChild
  }

  render() {
    return (
      <VisualizerProvider>
        <div>
          { this.state.isShowingChild && <TracedChild/> }
          { this.state.isShowingLegacyChild && <TracedLegacyChild prop={this.state.legacyProp}/> }
          { this.state.isShowingLegacyUnsafeChild && <TracedLegacyUnsafeChild prop={this.state.legacyProp}/> }
          <Log/>
        </div>
      </VisualizerProvider>
    );
  }
}

const formatLogEntries = (instanceName, logMethods) => logMethods.map((e, i) =>
  ('' + i).padStart(2) + ` ${instanceName}: ` + e // NOTE: padding assumes <=100 entries
);

let wrapper;

beforeEach(() => {
  wrapper = mount(<Wrapper/>);
});

afterEach(() => {
  wrapper.unmount();
  jest.runAllTimers();
  resetInstanceIdCounters();
  clearLog();
});

describe('traceLifecycle', () => {
  it('preserves static properties', () => {
    expect(TracedChild.staticProperty).toBe('a static property');
  });
});

describe('LifecyclePanel', () => {
  it('shows which methods are implemented', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    wrapper.find('.lifecycle-method').forEach((node) => {
      expect(node.prop('data-is-implemented')).toEqual(true);
    });
  });

  it('shows new methods for non-legacy component', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    expect(wrapper.find('.lifecycle-method')).toHaveLength(nNewLifecyclePanelMethods);
  });

  it('shows legacy methods for legacy component', () => {
    wrapper.setState({isShowingLegacyChild: true}); // Mount TracedLegacyChild
    expect(wrapper.find('.lifecycle-method')).toHaveLength(nLegacyLifecyclePanelMethods);
  });
});

describe('Log', () => {
  it('sequentially highlights log entries', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runOnlyPendingTimers(); // log entries are generated asynchronously, so run timers once
    wrapper.update();

    const nLogEntries = wrapper.find('.entry').length;
    expect(nLogEntries).toBeGreaterThan(0);

    for (let i = 0; i < nLogEntries; i++) {
      expect(wrapper.find('.entry').map((node) => node.prop('data-is-highlighted'))).toEqual(
        booleanListOnlyTrueAt(nLogEntries, i)
      );
      jest.runOnlyPendingTimers(); // not necessary for last iteration, but harmless
      wrapper.update();
    }
  });

  it('highlights the corresponding panel method', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runOnlyPendingTimers(); // log entries are generated asynchronously, so run timers once
    wrapper.update();
    wrapper.find('.entry').at(0).simulate('mouseEnter'); // Hover over 'constructor' log entry
    expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
      booleanListOnlyTrueAt(9, 0) // panel method 0 is 'constructor'
    );
    wrapper.find('.entry').at(4).simulate('mouseEnter'); //  Hover over 'render' log entry
    expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
      booleanListOnlyTrueAt(nNewLifecyclePanelMethods, 3) // panel method 3 is 'render'
    );
  });

  it('logs all new lifecycle methods', () => {
    wrapper.setState({isShowingChild: true});                      // Mount TracedChild
    wrapper.find(TracedChild).childAt(0).instance().updateState(); // Update TracedChild state
    wrapper.setState({isShowingChild: false});                     // Unmount TracedChild
    jest.runAllTimers();
    wrapper.update();

    const expectedLogEntries = [
      // Mount TracedChild
      'constructor',
      'custom:constructor',
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'render',
      'custom:render',
      'componentDidMount',
      'custom:componentDidMount',

      // Update TracedChild state
      'setState',
      'setState:update fn',
      'custom:setState update fn',
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'render',
      'custom:render',
      'getSnapshotBeforeUpdate',
      'custom:getSnapshotBeforeUpdate',
      'componentDidUpdate',
      'custom:componentDidUpdate',
      'setState:callback',
      'custom:setState callback',

      // Unmount TracedChild
      'componentWillUnmount',
      'custom:componentWillUnmount',
    ];

    expect(wrapper.find('.entry').map((node) => node.text()))
      .toEqual(formatLogEntries('Child-1', expectedLogEntries)
    );
  });

  it('logs all legacy lifecycle methods', () => {
    wrapper.setState({isShowingLegacyChild: true});                      // Mount TracedLegacyChild
    wrapper.setState({legacyProp: 42});                                  // Update TracedLegacyChild props
    wrapper.find(TracedLegacyChild).childAt(0).instance().updateState(); // Update TracedLegacyChild state
    wrapper.setState({isShowingLegacyChild: false});                     // Unmount TracedLegacyChild

    jest.runAllTimers();
    wrapper.update();

    const expectedLogEntries = [
      // Mount TracedLegacyChild
      'constructor',
      'custom:constructor',
      'componentWillMount',
      'custom:componentWillMount',
      'render',
      'custom:render',
      'componentDidMount',
      'custom:componentDidMount',

      // Update TracedLegacyChild props
      'componentWillReceiveProps',
      'custom:componentWillReceiveProps',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'componentWillUpdate',
      'custom:componentWillUpdate',
      'render',
      'custom:render',
      'componentDidUpdate',
      'custom:componentDidUpdate',

      // Update TracedLegacyChild state
      'setState',
      'setState:update fn',
      'custom:setState update fn',
      'shouldComponentUpdate',
      'custom:shouldComponentUpdate',
      'componentWillUpdate',
      'custom:componentWillUpdate',
      'render',
      'custom:render',
      'componentDidUpdate',
      'custom:componentDidUpdate',
      'setState:callback',
      'custom:setState callback',

      // Unmount TracedLegacyChild
      'componentWillUnmount',
      'custom:componentWillUnmount',
    ];

    expect(wrapper.find('.entry').map((node) => node.text()))
      .toEqual(formatLogEntries('LegacyChild-1', expectedLogEntries)
    );
  });

  it('logs all legacy UNSAFE_ lifecycle methods', () => {
    wrapper.setState({isShowingLegacyUnsafeChild: true});                      // Mount TracedLegacyUnsafeChild
    wrapper.setState({legacyProp: 42});                                        // Update TracedLegacyUnsafeChild props

    jest.runAllTimers();
    wrapper.update();

    const expectedLogEntries = [
    // Mount TracedLegacyUnsafeChild
    'constructor',
    'componentWillMount',
    'custom:UNSAFE_componentWillMount',
    'render',
    'componentDidMount',

    // Update TracedLegacyUnsafeChild props
    'componentWillReceiveProps',
    'custom:UNSAFE_componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'custom:UNSAFE_componentWillUpdate',
    'render',
    'componentDidUpdate',
    ];

    expect(wrapper.find('.entry').map((node) => node.text()))
      .toEqual(formatLogEntries('LegacyUnsafeChild-1', expectedLogEntries)
    );
  });

  it('is cleared by clearLog()', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.entry')).not.toHaveLength(0);

    clearLog();
    wrapper.update();

    expect(wrapper.find('.entry')).toHaveLength(0);
  });
});

describe('instanceId counter', () => {
  it('starts at 1', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-1/);
  });

  it('increments on remount', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
    jest.runAllTimers();
    clearLog();
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-2/);
  });

  it('is reset by resetInstanceIdCounters', () => {
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
    jest.runAllTimers();
    clearLog();
    resetInstanceIdCounters();
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-1/);
  });
});
