import React, {useState } from 'react';
import { Log, VisualizerProvider } from '../src';

const StateToggle = ({testId, checked, setChecked}) => {
  const onChange = ({currentTarget}) => setChecked(currentTarget.checked);

  return <input type='checkbox' data-testid={testId} checked={checked} onChange={onChange}/>;
};

// Wrapper to add VisualizerProvider and log, with buttons for showing/hiding child and updating child prop.
export const Wrapper = ({renderChild}) => {
  const [isShowingChild, setIsShowingChild] = useState(true);
  const [propValue, setPropValue] = useState(false);
  return (
    <VisualizerProvider>
      <div>
        <StateToggle testId='show-child-checkbox' checked={isShowingChild} setChecked={setIsShowingChild}/>
        <StateToggle testId='prop-value-checkbox' checked={propValue} setChecked={setPropValue}/>
        {isShowingChild && renderChild({prop: true})}
        <Log/>
      </div>
    </VisualizerProvider>
  );
};
