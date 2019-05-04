/* global sessionStorage:false */
/* eslint no-unused-vars: [1, { "args": "none" }] */
import * as constants from '../constants';
import * as util from '../util';

// Primitive actions:

const addLogEntry = (componentName, instanceId, methodName) => (
  {type: 'ADD_LOG_ENTRY', componentName, instanceId, methodName}
);

const clearLogEntries = () => (
  {type: 'CLEAR_LOG_ENTRIES'}
);

const setHighlight = (highlightedIndex) => (
  {type: 'SET_HIGHLIGHT', highlightedIndex}
);

const setReplayTimerId = (replayTimerId) => (
  {type: 'SET_REPLAY_TIMER_ID', replayTimerId}
);

const setReplayTimerDelayPrim = (replayTimerDelay) => (
  {type: 'SET_REPLAY_TIMER_DELAY', replayTimerDelay}
);

// Thunk actions:

export const pauseReplay = () => (dispatch, getState) => {
  const {replayTimerId} = getState();
  if (replayTimerId !== null) {
    clearInterval(replayTimerId);
    dispatch(setReplayTimerId(null));
  }
};

const replayStep = () => (dispatch, getState) => {
  const {highlightedIndex, logEntries} = getState();
  if (highlightedIndex < logEntries.length - 1) {
    dispatch(setHighlight(highlightedIndex + 1));
  } else {
    dispatch(pauseReplay());
  }
};

export const startReplay = () => (dispatch, getState) => {
  const {replayTimerId, replayTimerDelay} = getState();
  if (replayTimerId === null) {
    const timerId = setInterval(
      () => dispatch(replayStep()),
      replayTimerDelay * 1000
    );
    dispatch(setReplayTimerId(timerId));
  }
};

export const highlight = (highlightedIndex) => (dispatch, getState) => {
  dispatch(pauseReplay());
  dispatch(setHighlight(highlightedIndex));
};

export const stepLog = (step) => (dispatch, getState) => {
  const {highlightedIndex, logEntries} = getState();
  dispatch(pauseReplay());
  const newIndex = highlightedIndex + step;
  const clippedIndex = Math.min(logEntries.length - 1, Math.max(0, newIndex));
  dispatch(setHighlight(clippedIndex));
};

export const trace = (componentName, instanceId, methodName) => (dispatch, getState) => {
  if (constants.shouldLogInConsole) {
    /* eslint no-console: 0 */
    console.log(`${util.getTimeStamp()} ${componentName}-${instanceId}: ${methodName}`);
  }

  setTimeout(() => { // Async, so we can log from render
    const {logEntries, replayTimerId} = getState();
    dispatch(addLogEntry(componentName, instanceId, '' + methodName));
    if (replayTimerId === null) {
      dispatch(setHighlight(logEntries.length));
      dispatch(startReplay());
    }
  }, 0);
};

export const clearLog = () => (dispatch, getState) => {
  dispatch(pauseReplay());
  dispatch(clearLogEntries());
};

export const setReplayTimerDelay = (replayTimerDelay) => (dispatch, getState) => {
  sessionStorage.setItem(constants.sessionReplayTimerDelayKey, replayTimerDelay);
  dispatch(setReplayTimerDelayPrim(replayTimerDelay));
};

export const setDelay = (replayTimerDelay) => (dispatch, getState) => {
  dispatch(setReplayTimerDelay(replayTimerDelay));
  const {replayTimerId} = getState();
  if (replayTimerId !== null) {
    dispatch(pauseReplay());
    const timerId = setInterval(() => dispatch(replayStep()), replayTimerDelay * 1000);
    dispatch(setReplayTimerId(timerId));
  }
};
