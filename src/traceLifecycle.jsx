import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

import * as constants from './constants';
import * as ActionCreators from './redux/actionCreators';
import { withDeprecationWarning } from './util';
import LifecyclePanel from './components/LifecyclePanel';
import { MConstructor, MShouldUpdate, MRender, MDidMount,
         MDidUpdate, MWillUnmount, MSetState, MGetDerivedState,
         MGetSnapshot, MWillMount, MWillReceiveProps, MWillUpdate } from './constants';

const instanceIdCounters = {};

export const resetInstanceIdCounters = () => {
  Object.keys(instanceIdCounters).forEach((k) => delete instanceIdCounters[k]);
};

export const clearInstanceIdCounters = withDeprecationWarning(
  constants.DEPRECATED_CLEAR_COUNTERS,
  resetInstanceIdCounters
);

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
      super(props, context, props.trace);
      this.LifecyclePanel = withDeprecationWarning(
        constants.DEPRECATED_THIS_LIFECYCLE_PANEL,
        props.LifecyclePanel
      );
      this.trace = withDeprecationWarning(
        constants.DEPRECATED_THIS_TRACE,
        props.trace
      );
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

    static getDerivedStateFromProps(nextProps, prevState) {
      nextProps.trace(MGetDerivedState);
      return ComponentToTrace.getDerivedStateFromProps
               ? ComponentToTrace.getDerivedStateFromProps(nextProps, prevState, nextProps.trace)
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

    render() {
      if (super.render) {
        this.props.trace(MRender);
        return super.render();
      }
      return undefined; // no super.render, this will trigger a React error
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

      // Unlike the lifecycle methods we only trace the update function and callback
      // when they are actually defined.
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
          this.context[constants.reduxStoreKey].dispatch(
            ActionCreators.trace(componentToTraceName, instanceId, methodName)
          );
        };
    }

    render() {
      return <TracedComponent LifecyclePanel={this.LifecyclePanel} trace={this.trace} {...this.props}/>;
    }

    // Get store directly from context, to prevent introducing extra `Connect` component.
    static contextTypes = {
      ...ComponentToTrace.contextTypes, // preserve contextTypes from ComponentToTrace
      [constants.reduxStoreKey]: PropTypes.object
    }

    static displayName =
      `traceLifecycle(${componentToTraceName})`;
  }

  // Removing the inappropriate methods is simpler than adding appropriate methods to prototype
  if (isLegacy) {
    delete TracedComponent.getDerivedStateFromProps;
    delete TracedComponent.prototype.getSnapshotBeforeUpdate;
  } else {
    delete TracedComponent.prototype.componentWillMount;
    delete TracedComponent.prototype.componentWillReceiveProps;
    delete TracedComponent.prototype.componentWillUpdate;
  }

  return hoistStatics(TracingComponent, ComponentToTrace);
}
