import * as React from 'react';
import { Fragment } from 'react';

export const Tagged = ({name, showProps, children}) => {
  const shownProps = !showProps ? '' : ' ' +
    Object.entries(showProps).map(([key, val]) =>
      key + '={' + JSON.stringify(val) + '}'
    ).join(' ');

  return (
    <div>
      { (React.Children.count(children) === 0)
        ? <span className='tag'>{'<' + name + shownProps + '/>'}</span>
        : <Fragment>
            <span className='tag'>{'<' + name + shownProps + '>'}</span>
            <div className='indented'>{children}</div>
            <span className='tag'>{'</' + name + '>'}</span>
          </Fragment>
      }
    </div>
  );
};

export const LabeledCheckbox = ({label, checked, onChange}) => (
  <label>
    <input type='checkbox' checked={checked} onChange={onChange}/>
    {label}
  </label>
);

export const Button = ({value, onClick}) => (
  <span className='simple-button' onClick={onClick}>{value}</span>
);
