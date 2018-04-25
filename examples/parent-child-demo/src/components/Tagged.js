import React, { Fragment } from 'react';

const Tagged = ({name, showProps, children}) => {
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

export default Tagged;
