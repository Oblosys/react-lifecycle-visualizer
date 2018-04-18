export const shouldLogInConsole = false;

export const delayValues = [0.25, 0.5, 1, 2, 5, 10];

export const M_Constructor      = 'constructor';
export const M_DidMount         = 'componentDidMount';
export const M_ShouldUpdate     = 'shouldComponentUpdate';
export const M_Render           = 'render';
export const M_DidUpdate        = 'componentDidUpdate';
export const M_WillUnmount      = 'componentWillUnmount';
export const M_SetState         = 'setState';

export const M_GetDerivedState  = 'static getDerivedStateFromProps';
export const M_GetSnapshot      = 'getSnapshotBeforeUpdate';

export const M_WillMount        = 'componentWillMount';
export const M_WillReceiveProps = 'componentWillReceiveProps';
export const M_WillUpdate       = 'componentWillUpdate';

const lifecycleMethods = [
  {isLegacy: false, isNew: false, name: M_Constructor},
  {isLegacy: true,  isNew: false, name: M_WillMount},
  {isLegacy: false, isNew: true,  name: M_GetDerivedState},
  {isLegacy: true,  isNew: false, name: M_WillReceiveProps},
  {isLegacy: false, isNew: false, name: M_ShouldUpdate},
  {isLegacy: true,  isNew: false, name: M_WillUpdate},
  {isLegacy: false, isNew: false, name: M_Render},
  {isLegacy: false, isNew: false, name: M_DidMount},
  {isLegacy: false, isNew: true,  name: M_GetSnapshot},
  {isLegacy: false, isNew: false, name: M_DidUpdate},
  {isLegacy: false, isNew: false, name: M_WillUnmount},
  {isLegacy: false, isNew: false, name: M_SetState}
];

export const lifecycleMethodNames =
  lifecycleMethods.filter((mthd) => !mthd.isLegacy).map(({name}) => name);

export const lifecycleMethodNamesLegacy =
  lifecycleMethods.filter((mthd) => !mthd.isNew).map(({name}) => name);

export const lifecycleMethodNamesNewOnly =
  lifecycleMethods.filter((mthd) => mthd.isNew).map(({name}) => name);

export const lifecycleMethodNamesLegacyOnly =
  lifecycleMethods.filter((mthd) => mthd.isLegacy).map(({name}) => name);

const sessionStorageKey = '@@react-lifecycle-visualizer--persistent-state:';
export const sessionSelectedSampleKey   = sessionStorageKey + 'selectedSample';
export const sessionReplayTimerDelayKey = sessionStorageKey + 'replayTimerDelay';
