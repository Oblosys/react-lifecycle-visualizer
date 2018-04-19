import React from 'react';

const SimpleButton = ({value, onClick}) => (
  <span className='simple-button' onClick={onClick}>{value}</span>
);

export default SimpleButton;
