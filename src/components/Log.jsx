import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import * as constants from '../constants';
import * as ActionCreators from '../redux/actionCreators';
import { Button } from '../Util';

const mapStateToProps = ({logEntries, highlightedIndex, replayTimerId, replayTimerDelay}) =>
  ({logEntries, highlightedIndex, replayTimerId, replayTimerDelay});

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
          <span className='title'>Log</span>{' '}
          <Button value='clear log'          onClick={() => this.props.clearLog()}/>{' '}
          <span className='emoji-button'     onClick={() => this.props.stepLog(-1)}>{'\u23EA'}</span>
          { this.props.replayTimerId === null
            ? <span className='emoji-button' onClick={() => this.props.startReplay()}>{'\u25B6\uFE0F'}</span>
            : <span className='emoji-button' onClick={() => this.props.pauseReplay()}>{'\u23F8'}</span> }
          <span className='emoji-button'     onClick={() => this.props.stepLog(1)}>{'\u23E9'}</span>
          {' '}Delay:
          <DelaySelector
            value={this.props.replayTimerDelay}
            onChange={(evt) => this.props.setDelay(+evt.currentTarget.value)}
          />
          <div>(hover to highlight, shift-up/down to navigate)</div>
        </div>
        <Entries
          entries={this.props.logEntries}
          highlightedIndex={this.props.highlightedIndex}
          highlight={this.props.highlight}
        />
      </div>
    );
  }
}

class Entries extends Component {
  highlight = (index) => {
    this.props.highlight(index);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.entries.length !== this.props.entries.length) {
      this.messagesElt.scrollTop = this.messagesElt.scrollHeight - this.messagesElt.clientHeight;
    }
  }
  render() {
    const indexWidth = 1 + Math.log10(this.props.entries.length);
    const componentNameWidth = 2 +
      Math.max(...this.props.entries.map(
       ({componentName, instanceId}) => componentName.length + ('' + instanceId).length + 1)
      );
    return (
      <div className='entries' ref={(elt) => { this.messagesElt = elt; }}>
        { this.props.entries.map(({componentName, instanceId, methodName}, i) => (
            <div className='entry-wrapper' key={i}>
              <div
                className='entry'
                data-is-highlighted={i === this.props.highlightedIndex}
                onMouseEnter={() => this.highlight(i)}
              >{ ('' + i).padStart(indexWidth) +  ' ' +
                 (componentName + '-' + instanceId + ':').padEnd(componentNameWidth) +
                 methodName }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

const DelaySelector = ({value, onChange}) => (
  <select value={value} onChange={onChange}>
    { constants.delayValues.map((delay) =>
       <option value={delay} key={delay}>{delay}s</option>
      )
    }
  </select>
);

export default connect(mapStateToProps, ActionCreators, null, {storeKey: constants.reduxStoreKey})(Log);
