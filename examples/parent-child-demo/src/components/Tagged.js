import React from 'react';

const Tagged = ({name, showProps, children}) => {
  const shownProps = !showProps ? '' : ' ' +
    Object.entries(showProps).map(([key, val]) =>
      key + '={' + JSON.stringify(val) + '}'
    ).join(' ');

  return (
    <div className='tagged'>
      { (React.Children.count(children) === 0)
        ? <span className='tag'>{'<' + name + shownProps + '/>'}</span>
        : <>
            <span className='tag'>{'<' + name + shownProps + '>'}</span>
            <div className='indented'>{children}</div>
            <span className='tag'>{'</' + name + '>'}</span>
          </>
      }
    </div>
  );
};

export default Tagged;
