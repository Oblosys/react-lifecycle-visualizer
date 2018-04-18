import * as React from 'react';
import { connect } from 'react-redux';

import * as constants from './constants.js';

const LifecyclePanel = (props) => {
  const {componentName, isLegacy, instanceId, highlightedMethod, implementedMethods} = props;
  const lifecycleMethodNames = isLegacy ? constants.lifecycleMethodNamesLegacy : constants.lifecycleMethodNames;

  return (
    <div className='lifecycle-panel'>
      <div className='lifecycle-panel-inner'>
        <div className='component-instance'>{componentName + '-' + instanceId}</div>
        { lifecycleMethodNames.map((methodName) =>
            <LifecycleMethod
              componentName={componentName}
              instanceId={instanceId}
              highlightedMethod={highlightedMethod}
              methodName={methodName}
              methodIsImplemented={implementedMethods.includes(methodName)}
              key={methodName}
            />
          )
        }
      </div>
    </div>
  );
};

const LifecycleMethod = (props) => {
  const {highlightedMethod, componentName, instanceId, methodName, methodIsImplemented} = props;
  const methodIsHighlighted = isHighlighted(highlightedMethod, {componentName, instanceId, methodName});
  return (
    <div
      className='lifecycle-method'
      data-is-implemented={methodIsImplemented}
      data-is-highlighted={methodIsHighlighted}
    >
      { methodName }
    </div>
  );
};

const isHighlighted =  (hlMethod, method) => {
  return hlMethod !== null &&
    hlMethod.componentName === method.componentName &&
    hlMethod.instanceId === method.instanceId &&
    hlMethod.methodName.startsWith(method.methodName) // for handling 'setState:update fn' & 'setState:callback'
}

const mapStateToProps = ({logEntries, highlightedIndex}) => ({
  highlightedMethod: highlightedIndex !== null && logEntries[highlightedIndex]
  ? logEntries[highlightedIndex]
  : null
});

export default connect(mapStateToProps)(LifecyclePanel);
