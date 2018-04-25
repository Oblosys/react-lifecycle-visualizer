import React from 'react';

const LabeledCheckbox = ({label, checked, onChange}) => (
  <label>
    <input type='checkbox' checked={checked} onChange={onChange}/>
    {label}
  </label>
);

export default LabeledCheckbox;
