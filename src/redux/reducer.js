/* global sessionStorage:false */
import * as constants from '../constants';

const sessionReplayTimerDelay = sessionStorage.getItem(constants.sessionReplayTimerDelayKey);

const initialState = {
  logEntries: [],
  highlightedIndex: null,
  replayTimerId: null,
  replayTimerDelay: sessionReplayTimerDelay ? +sessionReplayTimerDelay : constants.delayValues[1],
};

// eslint-disable-next-line default-param-last
export const reducer = (state = initialState, action) => {
  // console.log('reducing', action, state);
  switch (action.type) {
    case 'ADD_LOG_ENTRY': {
      const {componentName, instanceId, methodName} = action;
      return {
        ...state,
        logEntries: [...state.logEntries, {componentName, instanceId, methodName}]
      };
    }
    case 'CLEAR_LOG_ENTRIES': {
      return {...state, logEntries: []};
    }
    case 'SET_HIGHLIGHT': {
      return {...state, highlightedIndex: action.highlightedIndex};
    }
    case 'SET_REPLAY_TIMER_ID': {
      return {...state, replayTimerId: action.replayTimerId};
    }
    case 'SET_REPLAY_TIMER_DELAY': {
      return {...state, replayTimerDelay: action.replayTimerDelay};
    }
    default: {
      return state;
    }
  }
};
