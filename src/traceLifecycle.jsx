import React from 'react';
import PropTypes from 'prop-types';

import * as constants from './constants';
import * as ActionCreators from './redux/actionCreators';
import LifecyclePanel from './components/LifecyclePanel';
import { MConstructor, MShouldUpdate, MRender, MDidMount,
         MDidUpdate, MWillUnmount, MSetState, MGetDerivedState,
         MGetSnapshot, MWillMount, MWillReceiveProps, MWillUpdate } from './constants';

const instanceIdCounters = {};
const traceSym = Symbol('trace'); // for sneaking trace function into the state

export const clearInstanceIdCounters = () => {
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
  const superMethods = Object.getOwnPropertyNames(ComponentToTrace.prototype).concat(
    ComponentToTrace.getDerivedStateFromProps ? [MGetDerivedState] : []
  );

  const isLegacy = // component is legacy if it includes one of the legacy methods and no new methods.
    superMethods.some((member) => constants.lifecycleMethodNamesLegacyOnly.includes(member)) &&
    superMethods.every((member) => !constants.lifecycleMethodNamesNewOnly.includes(member));

  const implementedMethods = [...superMethods, MSetState];

  class TracingComponent extends ComponentToTrace {
    constructor(props, context) {
      super(props, context);

      const instanceId = mkInstanceId(ComponentToTrace.name);

      this.LifecyclePanel = () => (
        <LifecyclePanel
          componentName={ComponentToTrace.name}
          isLegacy={isLegacy}
          instanceId={instanceId}
          implementedMethods={implementedMethods}
        />
      );

      this.trace = (methodName) => {
        this.context[constants.reduxStoreKey].dispatch(
          ActionCreators.trace(ComponentToTrace.name, instanceId, methodName)
        );
      };

      // HACK: need trace in state since static getDerivedStateFromProps can't access instance or context :-(
      if (this.state) {
        this.state[traceSym] = this.trace.bind(this);
      }
      this.trace(MConstructor);
    }

    // Get store directly from context, to prevent introducing extra `Connect` component.
    static contextTypes = {
      ...ComponentToTrace.contextTypes, // preserve contextTypes from ComponentToTrace
      [constants.reduxStoreKey]: PropTypes.object
    }

    componentWillMount() {
      this.trace(MWillMount);
      if (super.componentWillMount) {
        super.componentWillMount();
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const trace = prevState[traceSym];
      if (prevState && prevState[traceSym]) {
        trace(MGetDerivedState);
      }
      return ComponentToTrace.getDerivedStateFromProps
               ? ComponentToTrace.getDerivedStateFromProps(nextProps, prevState, trace)
               // Pass trace as third argument, since this.trace is unavailable in static method.
               : null;
    }

    componentDidMount() {
      this.trace(MDidMount);
      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }

    componentWillUnmount() {
      this.trace(MWillUnmount);
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }

    componentWillReceiveProps(...args) {
      this.trace(MWillReceiveProps);
      if (super.componentWillReceiveProps) {
        super.componentWillReceiveProps(...args);
      }
    }

    shouldComponentUpdate(...args) {
      this.trace(MShouldUpdate);
      return super.shouldComponentUpdate
             ? super.shouldComponentUpdate(...args)
             : true;
    }
    componentWillUpdate(...args) {
      this.trace(MWillUpdate);
      if (super.componentWillUpdate) {
        super.componentWillUpdate(...args);
      }
    }

    render() {
      if (super.render) {
        this.trace(MRender);
        return super.render();
      }
      return undefined; // no super.render, this will trigger a React error
    }

    getSnapshotBeforeUpdate(...args) {
      this.trace(MGetSnapshot);
      return super.getSnapshotBeforeUpdate
             ? super.getSnapshotBeforeUpdate(...args)
             : null;
    }

    componentDidUpdate(...args) {
      this.trace(MDidUpdate);
      if (super.componentDidUpdate) {
        super.componentDidUpdate(...args);
      }
    }

    setState(updater, callback) {
      this.trace(MSetState);

      // Unlike the lifecycle methods we only trace the update function and callback
      // when they are actually defined.
      const tracingUpdater = typeof updater !== 'function' ? updater : (...args) => {
        this.trace(MSetState + ':update fn');
        return updater(...args);
      };

      const tracingCallback = !callback ? undefined : (...args) => {
        this.trace(MSetState + ':callback');
        callback(...args);
      };
      super.setState(tracingUpdater, tracingCallback);
    }
  }

  TracingComponent.displayName =
    `traceLifecycle(${ComponentToTrace.displayName || ComponentToTrace.name || 'Component'})`;

  // Removing the inappropriate methods is simpler than adding appropriate methods to prototype
  if (isLegacy) {
    delete TracingComponent.getDerivedStateFromProps;
    delete TracingComponent.prototype.getSnapshotBeforeUpdate;
  } else {
    delete TracingComponent.prototype.componentWillMount;
    delete TracingComponent.prototype.componentWillReceiveProps;
    delete TracingComponent.prototype.componentWillUpdate;
  }

  return TracingComponent;
}
