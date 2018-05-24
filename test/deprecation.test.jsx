import React, { Component } from 'react';
import { mount } from 'enzyme';

import { clearInstanceIdCounters, clearLog, Log, resetInstanceIdCounters,
         traceLifecycle, VisualizerProvider } from '../src';

class Deprecated extends Component {
  render() {
    this.trace('deprecated trace');
    return <this.LifecyclePanel/>;
  }
}
const TracedDeprecated = traceLifecycle(Deprecated);

// Override console.warn for this test file
const warnSpy = jest.fn();
console.warn = warnSpy; // eslint-disable-line no-console

let wrapper;

beforeEach(() => {
  wrapper = mount(
    <VisualizerProvider>
      <div>
        <TracedDeprecated/>
        <Log/>
      </div>
    </VisualizerProvider>
  );
  jest.runOnlyPendingTimers();
  wrapper.update();
});

afterEach(() => {
  wrapper.unmount();
  jest.runAllTimers();
  resetInstanceIdCounters();
  clearLog();
});


describe('deprecated', () => {
  it('this.LifecyclePanel still works', () => {
    const deprecatedInstance = wrapper.find(TracedDeprecated).childAt(0).instance();
    const thisLifecyclePanel = deprecatedInstance.LifecyclePanel();
    expect(thisLifecyclePanel).toEqual(deprecatedInstance.props.LifecyclePanel());
  });

  it('this.trace still works', () => {
    expect(wrapper.find('.entry').map((node) => node.text())).toContainEqual(
      expect.stringMatching(/deprecated trace/)
    );
  });

  it('clearInstanceIdCounters still works', () => {
    wrapper.unmount();
    wrapper.mount();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.entry').last().text()).toMatch(/^ ?\d+ Deprecated-2/);
    wrapper.unmount();
    clearInstanceIdCounters();
    wrapper.mount();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.entry').last().text()).toMatch(/^ ?\d+ Deprecated-1/);
  });

  it('methods produce console warnings', () => {
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith(
      'WARNING: react-lifecycle-visualizer: ' +
      'this.LifecyclePanel is deprecated, please use this.props.LifecyclePanel instead.'
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'WARNING: react-lifecycle-visualizer: ' +
      'this.trace is deprecated, please use this.props.trace instead.'
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'WARNING: react-lifecycle-visualizer: ' +
      'clearInstanceIdCounters() is deprecated, please use resetInstanceIdCounters() instead.'
    );
  });
});
