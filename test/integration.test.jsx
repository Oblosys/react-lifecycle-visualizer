import React, { Component } from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { clearLog, Log, VisualizerProvider } from '../src';
import TracedChild from './TracedChild';

jest.useFakeTimers();
Enzyme.configure({ adapter: new Adapter() });

class Parent extends Component {
  state = { isShowingChild: false }
  render() {
    return (
      <div>
        <input type='button' id='mount-child-button' onClick={() => this.setState({isShowingChild: true})}/>
        <input type='button' id='unmount-child-button' onClick={() => this.setState({isShowingChild: false})}/>
        { this.state.isShowingChild && <TracedChild/> }
      </div>
    );
  }
}

describe('Log', () => {
    const app = mount(
      <VisualizerProvider>
        <div>
          <Parent/>
          <Log/>
        </div>
      </VisualizerProvider>
    );

    it('logs lifecycle methods', () => {
      app.find('#mount-child-button').simulate('click');
      app.find('#update-button').simulate('click');
      app.find('#unmount-child-button').simulate('click');
      jest.runAllTimers();
      app.update();

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

      expect(app.find('.entry').map((node) => node.text())).toEqual(formattedLogEntries);
    });

    it('highlights the last entry', () => {
      expect(app.find('.entry').last().prop('data-is-highlighted')).toEqual(true);
    });

    it('is cleared by clearLog()', () => {
      clearLog();
      app.update();

      expect(app.find('.entry')).toHaveLength(0);
    });
});
