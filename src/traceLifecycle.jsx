import * as React from 'react';
import PropTypes from 'prop-types';

import * as constants from './constants';
import * as ActionCreators from './actionCreators';
import LifecyclePanel from './LifecyclePanel';
import { MConstructor, MShouldUpdate, MRender, MDidMount,
         MDidUpdate, MWillUnmount, MSetState, MGetDerivedState,
         MGetSnapshot, MWillMount, MWillReceiveProps, MWillUpdate } from './constants';

const instanceIdCounters = {};
const traceSym = Symbol('trace'); // for sneaking trace function into the state

export const clearInstanceIdCounters = () => {
  Object.keys(instanceIdCounters).forEach((k) => delete instanceIdCounters[k]);
};

const mkInstanceId = (componentName) => {
  if (!instanceIdCounters.hasOwnProperty(componentName)) {
    instanceIdCounters[componentName] = 0;
  }
  instanceIdCounters[componentName] += 1;
  return instanceIdCounters[componentName];
};

export default function traceLifecycle(ComponentToTrace) {
  const superMembers = Object.keys(ComponentToTrace.prototype);

  const isLegacy = // component is legacy if it includes one of the legacy methods and no new methods.
    superMembers.some((member) => constants.lifecycleMethodNamesLegacyOnly.includes(member)) &&
    superMembers.every((member) => !constants.lifecycleMethodNamesNewOnly.includes(member));

  class TracingComponent extends ComponentToTrace {
    constructor(props, context) {
      super(props, context);

      const instanceId = mkInstanceId(ComponentToTrace.name);

      this.lifecyclePanel = (
        <LifecyclePanel
          componentName={ComponentToTrace.name}
          isLegacy={isLegacy}
          instanceId={instanceId}
          implementedMethods={[
            ...superMembers,
            ...(ComponentToTrace.getDerivedStateFromProps ? [MGetDerivedState] : []),
            MSetState
          ]}
        />
      );

      this.trace = (methodName) => {
        this.context.store.dispatch(
          ActionCreators.trace(ComponentToTrace.name, instanceId, methodName)
        );
      };

      // HACK: need trace in state since static getDerivedStateFromProps can't access instance or context :-(
      if (this.state) {
        this.state[traceSym] = this.trace.bind(this);
      }
      this.trace(MConstructor);
    }

    // Get store from context, to prevent update blocking by `connect`.
    static contextTypes = {
      store: PropTypes.object
    }

    componentWillMount() {
      this.trace(MWillMount);
      if (super.componentWillMount) {
        super.componentWillMount();
      }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
      if (prevState && prevState[traceSym]) {
        prevState[traceSym](MGetDerivedState);
      }
      return ComponentToTrace.getDerivedStateFromProps
               ? ComponentToTrace.getDerivedStateFromProps(...arguments)
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
    componentWillReceiveProps() {
      this.trace(MWillReceiveProps);
      if (super.componentWillReceiveProps) {
        super.componentWillReceiveProps(...arguments);
      }
    }
    shouldComponentUpdate() {
      this.trace(MShouldUpdate);
      return super.shouldComponentUpdate
             ? super.shouldComponentUpdate(...arguments)
             : true;
    }
    componentWillUpdate() {
      this.trace(MWillUpdate);
      if (super.componentWillUpdate) {
        super.componentWillUpdate(...arguments);
      }
    }
    render() {
      if (super.render) {
        this.trace(MRender);
        return super.render();
      }
      return undefined; // no super.render, this will trigger a React error
    }
    getSnapshotBeforeUpdate() {
      this.trace(MGetSnapshot);
      return super.getSnapshotBeforeUpdate
             ? super.getSnapshotBeforeUpdate(...arguments)
             : null;
    }
    componentDidUpdate() {
      this.trace(MDidUpdate);
      if (super.componentDidUpdate) {
        super.componentDidUpdate(...arguments);
      }
    }
    setState(updater, callback) {
      this.trace(MSetState);

      // Unlike the lifecycle methods we only trace the update function and callback
      // when they are actually defined.
      const tracingUpdater = typeof updater !== 'function' ? updater : () => {
        this.trace(MSetState + ':update fn');
        return updater(...arguments);
      };

      const tracingCallback = !callback ? undefined : () => {
        this.trace(MSetState + ':callback');
        callback(...arguments);
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
