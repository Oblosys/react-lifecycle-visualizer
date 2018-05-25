import * as React from 'react';
import { render } from 'react-dom';
import { resetInstanceIdCounters, clearLog, Log, traceLifecycle, VisualizerProvider, TraceProps }
  from 'react-lifecycle-visualizer';

// Basic test to check if the typings are consistent. Whether these types correspond to the actual JavaScript
// implementation is currently not tested, as we'd need to do a TypeScript webpack build for that.

resetInstanceIdCounters();
clearLog();

interface ComponentToTraceProps extends TraceProps {};
interface ComponentToTraceState {}

class ComponentToTrace extends React.Component<ComponentToTraceProps, ComponentToTraceState> {
  constructor(props: ComponentToTraceProps, context?: any) {
    props.trace('before super(props)');
    super(props, context);
    this.props.trace('after super(props)');
  }

  static getDerivedStateFromProps(nextProps : ComponentToTraceProps, nextState: ComponentToTraceState) {
    nextProps.trace('deriving');
    return null;
  }

  render() {
    return <this.props.LifecyclePanel/>;
  }
}

// Due to https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796, we cannot use `traceLifecycle` as a decorator
// in TypeScript, so we just apply it as a function.
const TracedComponent = traceLifecycle(ComponentToTrace);

const ProvidedComponent = () => (
  <VisualizerProvider>
    <div>
      <TracedComponent/>
      <Log/>
    </div>
  </VisualizerProvider>
);
render(<ProvidedComponent/>, document.getElementById('root'));
