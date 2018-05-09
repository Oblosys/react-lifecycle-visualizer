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

    it('logs lifecycle methods', () => {
      wrapper.setState({isShowingChild: true});
      wrapper.find(TracedChild).instance().forceUpdate();
      wrapper.setState({isShowingChild: false});
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

    it('highlights the last entry', () => {
      expect(wrapper.find('.entry').last().prop('data-is-highlighted')).toEqual(true);
    });

    it('is cleared by clearLog()', () => {
      clearLog();
      wrapper.update();

      expect(wrapper.find('.entry')).toHaveLength(0);
    });
});
