/* global document:false */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as constants from '../constants';
import * as ActionCreators from '../redux/actionCreators';
import LogEntries from './LogEntries';
import SimpleButton from './SimpleButton';

const DelaySelector = ({value, onChange}) => (
  <select value={value} onChange={onChange}>
    { constants.delayValues.map((delay) =>
       <option value={delay} key={delay}>{delay}s</option>
      )
    }
  </select>
);

class Log extends Component {
  onKeyDown = (evt) => {
    if (evt.shiftKey) { // Require shift to prevent interference with scrolling
      switch (evt.code) {
        case 'ArrowUp':
          this.props.stepLog(-1);
          break;
        case 'ArrowDown':
          this.props.stepLog(1);
          break;
      }
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    return (
      <div className='log'>
        <div className='header'>
          <div className='controls'>
            <div className='title'>Log</div>
            <div className='buttons'>
              <SimpleButton value='clear log'    onClick={() => this.props.clearLog()}/>{' '}
              <span className='emoji-button'     onClick={() => this.props.stepLog(-1)}>{'\u23EA'}</span>
              { this.props.replayTimerId === null
                ? <span className='emoji-button' onClick={() => this.props.startReplay()}>{'\u25B6\uFE0F'}</span>
                : <span className='emoji-button' onClick={() => this.props.pauseReplay()}>{'\u23F8'}</span> }
              <span className='emoji-button'     onClick={() => this.props.stepLog(1)}>{'\u23E9'}</span>
            </div>
            <div>
              Delay:
              <DelaySelector
                value={this.props.replayTimerDelay}
                onChange={(evt) => this.props.setDelay(+evt.currentTarget.value)}
              />
            </div>
          </div>
          <div>(hover to highlight, shift-up/down to navigate)</div>
        </div>
        <LogEntries
          entries={this.props.logEntries}
          highlightedIndex={this.props.highlightedIndex}
          highlight={this.props.highlight}
        />
      </div>
    );
  }
}

const mapStateToProps = ({logEntries, highlightedIndex, replayTimerId, replayTimerDelay}) =>
  ({logEntries, highlightedIndex, replayTimerId, replayTimerDelay});

export default connect(mapStateToProps, ActionCreators, null, {storeKey: constants.reduxStoreKey})(Log);
