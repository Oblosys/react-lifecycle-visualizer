import React, { Component } from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { clearLog, Log, VisualizerProvider } from '../src';
import TracedChild from './TracedChild';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });

// Return boolean array of length `n` which is true only at index `i`.
const booleanListOnlyTrueAt = (n, i) => Array.from({length: n}, (_undefined, ix) => ix === i);

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
          booleanListOnlyTrueAt(nLogEntries, i)
        );
        jest.runOnlyPendingTimers();
        wrapper.update();
      }
    });

    it('highlights the corresponding panel method', () => {
      wrapper.find('.entry').at(0).simulate('mouseEnter'); // 'constructor'
      expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
        booleanListOnlyTrueAt(9, 0) // 9 new lifecycle methods, 0 is 'constructor'
      );
      wrapper.find('.entry').at(3).simulate('mouseEnter'); // 'render'
      expect(wrapper.find('.lifecycle-method').map((node) => node.prop('data-is-highlighted'))).toEqual(
        booleanListOnlyTrueAt(9, 3) // 9 new lifecycle methods, 3 is 'render'
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
