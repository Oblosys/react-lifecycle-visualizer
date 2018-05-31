import React from 'react';

const LabeledCheckbox = ({label, checked, onChange}) => (
  <label className='labeled-checkbox'>
    <input type='checkbox' checked={checked} onChange={onChange}/>
    <div>{label}</div>
  </label>
);

export default LabeledCheckbox;
