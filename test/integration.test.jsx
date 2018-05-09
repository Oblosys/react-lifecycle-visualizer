import React, { Component } from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { clearLog, Log, VisualizerProvider } from '../src';
import TracedChild from './TracedChild';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });

class Wrapper extends Component {
  state = { isShowingChild: false }
  render() {
    return (
      <VisualizerProvider>
        <div>
          { this.state.isShowingChild && <TracedChild/> }
          <Log/>
        </div>
      </VisualizerProvider>
    );
  }
}

describe('Log', () => {
    const wrapper = mount(<Wrapper/>);

    it('sequentially highlights log entries', () => {
      wrapper.setState({isShowingChild: true}); // Mount TracedChild

      jest.runOnlyPendingTimers();
      wrapper.update();

      const nLogEntries = wrapper.find('.entry').length;
      for (let i = 0; i < nLogEntries; i++) {
        expect(wrapper.find('.entry').map((node) => node.prop('data-is-highlighted'))).toEqual(
          Array.from({length: nLogEntries}, (_undefined, ix) => ix === i)
        );
        jest.runOnlyPendingTimers();
        wrapper.update();
      }
    });

    it('logs all lifecycle methods', () => {
    wrapper.find(TracedChild).instance().forceUpdate(); // Update TracedChild
    wrapper.setState({isShowingChild: false}); // Unmount TracedChild

    jest.runAllTimers();
    wrapper.update();

      const expectedLogEntries = [
        'constructor',
        'static getDerivedStateFromProps',
        'custom:getDerivedStateFromProps',
        'render',
        'custom:render',
        'componentDidMount',
        'custom:componentDidMount',
        'render',
        'custom:render',
        'getSnapshotBeforeUpdate',
        'componentDidUpdate',
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
