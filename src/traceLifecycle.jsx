/* eslint max-classes-per-file: 0, react/jsx-props-no-spreading: 0, react/static-property-placement: 0 */
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';

import * as constants from './constants';
import * as ActionCreators from './redux/actionCreators';
import LifecyclePanel from './components/LifecyclePanel';
import { MConstructor, MShouldUpdate, MRender, MDidMount,
         MDidUpdate, MWillUnmount, MSetState, MGetDerivedState, MGetSnapshot,
         MWillMount, MWillReceiveProps, MWillUpdate,
         MUnsafeWillMount, MUnsafeWillReceiveProps, MUnsafeWillUpdate} from './constants';
import { store as lifecycleVisualizerStore } from './redux/VisualizerProvider';

const instanceIdCounters = {};

export const resetInstanceIdCounters = () => {
  Object.keys(instanceIdCounters).forEach((k) => delete instanceIdCounters[k]);
};

const mkInstanceId = (componentName) => {
  if (!Object.prototype.hasOwnProperty.call(instanceIdCounters, componentName)) {
    instanceIdCounters[componentName] = 0;
  }
  instanceIdCounters[componentName] += 1;
  return instanceIdCounters[componentName];
};

export default function traceLifecycle(ComponentToTrace) {
  const componentToTraceName = ComponentToTrace.displayName || ComponentToTrace.name || 'Component';

  const superMethods = Object.getOwnPropertyNames(ComponentToTrace.prototype).concat(
    ComponentToTrace.getDerivedStateFromProps ? [MGetDerivedState] : []
  );

  const isLegacy = // component is legacy if it includes one of the legacy methods and no new methods.
    superMethods.some((member) => constants.lifecycleMethodNamesLegacyOnly.includes(member)) &&
    superMethods.every((member) => !constants.lifecycleMethodNamesNewOnly.includes(member));

  const implementedMethods = [...superMethods, MSetState];

  class TracedComponent extends ComponentToTrace {
    constructor(props, context) {
      props.trace(MConstructor);
      super(props, context);
      if (!isLegacy && typeof this.state === 'undefined') {
        this.state = {};
        // Initialize state if it is undefined, otherwise the addition of getDerivedStateFromProps will cause a warning.
      }
    }

    componentWillMount() {
      this.props.trace(MWillMount);
      if (super.componentWillMount) {
        super.componentWillMount();
      }
    }

    UNSAFE_componentWillMount() { // eslint-disable-line camelcase
      this.props.trace(MWillMount); // trace it as 'componentWillMount' for brevity
      if (super.UNSAFE_componentWillMount) {
        super.UNSAFE_componentWillMount();
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      nextProps.trace(MGetDerivedState);
      return ComponentToTrace.getDerivedStateFromProps
               ? ComponentToTrace.getDerivedStateFromProps(nextProps, prevState)
               : null;
    }

    componentDidMount() {
      this.props.trace(MDidMount);
      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }

    componentWillUnmount() {
      this.props.trace(MWillUnmount);
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }

    componentWillReceiveProps(...args) {
      this.props.trace(MWillReceiveProps);
      if (super.componentWillReceiveProps) {
        super.componentWillReceiveProps(...args);
      }
    }

    UNSAFE_componentWillReceiveProps(...args) { // eslint-disable-line camelcase
      this.props.trace(MWillReceiveProps); // trace it as 'componentWillReceiveProps' for brevity
      if (super.UNSAFE_componentWillReceiveProps) {
        super.UNSAFE_componentWillReceiveProps(...args);
      }
    }

    shouldComponentUpdate(...args) {
      this.props.trace(MShouldUpdate);
      return super.shouldComponentUpdate
             ? super.shouldComponentUpdate(...args)
             : true;
    }

    componentWillUpdate(...args) {
      this.props.trace(MWillUpdate);
      if (super.componentWillUpdate) {
        super.componentWillUpdate(...args);
      }
    }

    UNSAFE_componentWillUpdate(...args) { // eslint-disable-line camelcase
      this.props.trace(MWillUpdate); // trace it as 'componentWillUpdate' for brevity
      if (super.UNSAFE_componentWillUpdate) {
        super.UNSAFE_componentWillUpdate(...args);
      }
    }

    render() {
      if (super.render) {
        this.props.trace(MRender);
        return super.render();
      }
      return undefined; // There's no super.render, which will trigger a React error
    }

    getSnapshotBeforeUpdate(...args) {
      this.props.trace(MGetSnapshot);
      return super.getSnapshotBeforeUpdate
             ? super.getSnapshotBeforeUpdate(...args)
             : null;
    }

    componentDidUpdate(...args) {
      this.props.trace(MDidUpdate);
      if (super.componentDidUpdate) {
        super.componentDidUpdate(...args);
      }
    }

    setState(updater, callback) {
      this.props.trace(MSetState);

      // Unlike the lifecycle methods we only trace the update function and callback when they are actually defined.
      const tracingUpdater = typeof updater !== 'function' ? updater : (...args) => {
        this.props.trace(MSetState + ':update fn');
        return updater(...args);
      };

      const tracingCallback = !callback ? undefined : (...args) => {
        this.props.trace(MSetState + ':callback');
        callback(...args);
      };
      super.setState(tracingUpdater, tracingCallback);
    }

    static displayName = componentToTraceName;
  }

  class TracingComponent extends Component {
    constructor(props, context) {
      super(props, context);

      const instanceId = mkInstanceId(ComponentToTrace.name);

      // eslint-disable-next-line react/no-unstable-nested-components
      const WrappedLifecyclePanel = () => (
          <LifecyclePanel
            componentName={componentToTraceName}
            isLegacy={isLegacy}
            instanceId={instanceId}
            implementedMethods={implementedMethods}
          />
      );
      this.LifecyclePanel = WrappedLifecyclePanel;

      this.trace = (methodName) => {
        // Just dispatch on lifecycleVisualizerStore directly, rather than introducing complexity by using context.
        lifecycleVisualizerStore.dispatch(
          ActionCreators.trace(componentToTraceName, instanceId, methodName)
        );
      };
    }

    render() {
      return <TracedComponent LifecyclePanel={this.LifecyclePanel} trace={this.trace} {...this.props}/>;
    }

    static displayName = `traceLifecycle(${componentToTraceName})`;
  }

  // Removing the inappropriate methods is simpler than adding appropriate methods to prototype.
  if (isLegacy) {
    delete TracedComponent.getDerivedStateFromProps;
    delete TracedComponent.prototype.getSnapshotBeforeUpdate;

    // Only keep the tracer method corresponding to the implemented super method, unless neither the old or the
    // UNSAFE_ method is implemented, in which case we keep the UNSAFE_ method.
    // NOTE: This allows both the old method and the UNSAFE_ version to be traced, but this is correct, as React calls
    //       both.
    const deleteOldOrUnsafe = (method, unsafeMethod) => {
      if (!superMethods.includes(method)) {
        delete TracedComponent.prototype[method];
      } else if (!superMethods.includes(unsafeMethod)) {
        delete TracedComponent.prototype[unsafeMethod];
      }
    };

    deleteOldOrUnsafe(MWillMount, MUnsafeWillMount);
    deleteOldOrUnsafe(MWillReceiveProps, MUnsafeWillReceiveProps);
    deleteOldOrUnsafe(MWillUpdate, MUnsafeWillUpdate);
  } else {
    delete TracedComponent.prototype.componentWillMount;
    delete TracedComponent.prototype.componentWillReceiveProps;
    delete TracedComponent.prototype.componentWillUpdate;
    delete TracedComponent.prototype.UNSAFE_componentWillMount;
    delete TracedComponent.prototype.UNSAFE_componentWillReceiveProps;
    delete TracedComponent.prototype.UNSAFE_componentWillUpdate;
  }

  return hoistStatics(TracingComponent, ComponentToTrace);
}
