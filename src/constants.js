export const shouldLogInConsole = false;

export const delayValues = [0.25, 0.5, 1, 2, 5, 10];

export const MConstructor      = 'constructor';
export const MDidMount         = 'componentDidMount';
export const MShouldUpdate     = 'shouldComponentUpdate';
export const MRender           = 'render';
export const MDidUpdate        = 'componentDidUpdate';
export const MWillUnmount      = 'componentWillUnmount';
export const MSetState         = 'setState';

export const MGetDerivedState  = 'static getDerivedStateFromProps';
export const MGetSnapshot      = 'getSnapshotBeforeUpdate';

export const MWillMount        = 'componentWillMount';
export const MWillReceiveProps = 'componentWillReceiveProps';
export const MWillUpdate       = 'componentWillUpdate';

const lifecycleMethods = [
  {isLegacy: false, isNew: false, name: MConstructor},
  {isLegacy: true,  isNew: false, name: MWillMount},
  {isLegacy: false, isNew: true,  name: MGetDerivedState},
  {isLegacy: true,  isNew: false, name: MWillReceiveProps},
  {isLegacy: false, isNew: false, name: MShouldUpdate},
  {isLegacy: true,  isNew: false, name: MWillUpdate},
  {isLegacy: false, isNew: false, name: MRender},
  {isLegacy: false, isNew: false, name: MDidMount},
  {isLegacy: false, isNew: true,  name: MGetSnapshot},
  {isLegacy: false, isNew: false, name: MDidUpdate},
  {isLegacy: false, isNew: false, name: MWillUnmount},
  {isLegacy: false, isNew: false, name: MSetState}
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
