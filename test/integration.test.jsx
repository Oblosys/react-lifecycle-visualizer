import React, { Component } from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { clearInstanceIdCounters, clearLog, Log, VisualizerProvider } from '../src';
import TracedChild from './TracedChild';
import TracedLegacyChild from './TracedLegacyChild';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });

// Return boolean array of length `n` which is true only at index `i`.
const booleanListOnlyTrueAt = (n, i) => Array.from({length: n}, (_undefined, ix) => ix === i);

const nNewLifecyclePanelMethods = 9;  // Non-legacy panel has 9 lifecycle methods
const nLegacyLifecyclePanelMethods = 10;  // Legacy panel has 10 lifecycle methods

class Wrapper extends Component {
  state = { isShowingChild: false, isShowingLegacyChild: false }
  render() {
    return (
      <VisualizerProvider>
        <div>
          { this.state.isShowingChild && <TracedChild/> }
          { this.state.isShowingLegacyChild && <TracedLegacyChild/> }
          <Log/>
        </div>
      </VisualizerProvider>
    );
  }
}

const cleanupAndReset = () => {
  jest.runAllTimers();
  clearInstanceIdCounters();
  clearLog();
};

describe('LifecyclePanel', () => {
  const wrapper = mount(<Wrapper/>);
  afterAll(cleanupAndReset);

  it('shows which methods are implemented', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-implemented'))).toEqual([
      true,  // 'constructor' (implemented by TracedChild)
      true,  // 'static getDerivedStateFromProps' (implemented by TracedChild)
      false, // 'shouldComponentUpdate'
      true,  // 'render' (implemented by TracedChild)
      true,  // 'componentDidMount' (implemented by TracedChild)
      false, // 'getSnapshotBeforeUpdate'
      false, // 'componentDidUpdate'
      false, // 'componentWillUnmount'
      true   // 'render' (implemented by TracedChild)
    ]);
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
  });

  it('shows new methods for non-legacy component', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    expect(wrapper.find('.lifecycle-method')).toHaveLength(nNewLifecyclePanelMethods);
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
  });

  it('shows legacy methods for legacy component', () => {
    wrapper.setState({isShowingLegacyChild: true}); // Mount TracedLegacyChild
    expect(wrapper.find('.lifecycle-method')).toHaveLength(nLegacyLifecyclePanelMethods);
    wrapper.setState({isShowingLegacyChild: false}); // Unmount TracedLegacyChild
  });
});

describe('Log', () => {
  const wrapper = mount(<Wrapper/>);
  afterAll(cleanupAndReset);

  it('sequentially highlights log entries', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild

    jest.runOnlyPendingTimers(); // log entries are generated asynchronously, so run timers once
    wrapper.update();

    const nLogEntries = wrapper.find('.entry').length;
    for (let i = 0; i < nLogEntries; i++) {
      expect(wrapper.find('.entry').map((node) => node.prop('data-is-highlighted'))).toEqual(
        booleanListOnlyTrueAt(nLogEntries, i)
      );
      jest.runOnlyPendingTimers(); // not necessary for last iteration, but harmless
      wrapper.update();
    }
  });

  it('highlights the corresponding panel method', () => {
    wrapper.find('.entry').at(0).simulate('mouseEnter'); // Hover over 'constructor' log entry
    expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
      booleanListOnlyTrueAt(9, 0) // panel method 0 is 'constructor'
    );
    wrapper.find('.entry').at(3).simulate('mouseEnter'); //  Hover over 'render' log entry
    expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
      booleanListOnlyTrueAt(nNewLifecyclePanelMethods, 3) // panel method 3 is 'render'
    );
  });

  it('logs all lifecycle methods', () => {
    wrapper.find(TracedChild).instance().forceUpdate(); // Update TracedChild
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild

    jest.runAllTimers();
    wrapper.update();

    const expectedLogEntries = [
      // Mount TracedChild
      'constructor',
      'static getDerivedStateFromProps',
      'custom:getDerivedStateFromProps',
      'render',
      'custom:render',
      'componentDidMount',
      'custom:componentDidMount',

      // Update TracedChild
      'render',
      'custom:render',
      'getSnapshotBeforeUpdate',
      'componentDidUpdate',

      // Unmount TracedChild
      'componentWillUnmount'
    ];
    const formattedLogEntries = expectedLogEntries.map((e, i) =>
      ('' + i).padStart(2) + ' Child-1: ' + e // NOTE: padding assumes <=100 entries
    );

    expect(wrapper.find('.entry').map((node) => node.text())).toEqual(formattedLogEntries);
  });

  it('is cleared by clearLog()', () => {
    clearLog();
    wrapper.update();

    expect(wrapper.find('.entry')).toHaveLength(0);
  });
});

describe('instanceId counters', () => {
  const wrapper = mount(<Wrapper/>);
  afterAll(cleanupAndReset);

  it('start at 1', () => {
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-1/);
  });

  it('increment', () => {
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
    jest.runAllTimers();
    clearLog();
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-2/);
  });

  it('are reset by clearInstanceIdCounters', () => {
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild
    jest.runAllTimers();
    clearLog();
    clearInstanceIdCounters();
    wrapper.setState({isShowingChild: true}); // Mount TracedChild
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.entry').first().text()).toMatch(/^ ?\d+ Child-1/);
  });
});
