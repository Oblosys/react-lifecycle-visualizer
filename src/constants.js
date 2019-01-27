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

export const MUnsafeWillMount        = 'UNSAFE_componentWillMount';
export const MUnsafeWillReceiveProps = 'UNSAFE_componentWillReceiveProps';
export const MUnsafeWillUpdate       = 'UNSAFE_componentWillUpdate';

const lifecycleMethods = [
  {isLegacy: false, isNew: false, name: MConstructor},
  {isLegacy: true,  isNew: false, name: MWillMount},
  {isLegacy: true,  isNew: false, name: MUnsafeWillMount},
  {isLegacy: false, isNew: true,  name: MGetDerivedState},
  {isLegacy: true,  isNew: false, name: MWillReceiveProps},
  {isLegacy: true,  isNew: false, name: MUnsafeWillReceiveProps},
  {isLegacy: false, isNew: false, name: MShouldUpdate},
  {isLegacy: true,  isNew: false, name: MWillUpdate},
  {isLegacy: true,  isNew: false, name: MUnsafeWillUpdate},
  {isLegacy: false, isNew: false, name: MRender},
  {isLegacy: false, isNew: false, name: MDidMount},
  {isLegacy: false, isNew: true,  name: MGetSnapshot},
  {isLegacy: false, isNew: false, name: MDidUpdate},
  {isLegacy: false, isNew: false, name: MWillUnmount},
  {isLegacy: false, isNew: false, name: MSetState}
];

export const lifecycleMethodNames =
  lifecycleMethods.filter((mthd) => !mthd.isLegacy).map(({name}) => name);

// We don't show 'UNSAFE_..' in the panel, but just use the shorter old names.
export const lifecycleMethodNamesLegacyNoUnsafe =
  lifecycleMethods.filter(
    (mthd) => !mthd.isNew && !mthd.name.startsWith('UNSAFE_')
  ).map(({name}) => name);

export const lifecycleMethodNamesNewOnly =
  lifecycleMethods.filter((mthd) => mthd.isNew).map(({name}) => name);

export const lifecycleMethodNamesLegacyOnly =
  lifecycleMethods.filter((mthd) => mthd.isLegacy).map(({name}) => name);

const sessionStorageKey = '@@react-lifecycle-visualizer--persistent-state:';
export const sessionReplayTimerDelayKey = sessionStorageKey + 'replayTimerDelay';

export const DEPRECATED_THIS_LIFECYCLE_PANEL = 'DEPRECATED_THIS_LIFECYCLE_PANEL';
export const DEPRECATED_THIS_TRACE = 'DEPRECATED_THIS_TRACE';
export const DEPRECATED_CLEAR_COUNTERS = 'DEPRECATED_CLEAR_COUNTERS';
