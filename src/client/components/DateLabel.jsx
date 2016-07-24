import React from 'react';

export function DateLabel({ children, style }) {
  return (
    <div style={ style }>
      {
        mapValueIndexToDateString(children)
      }
    </div>
  );
}

DateLabel.propTypes = {
  children: React.PropTypes.number,
  style: React.PropTypes.object,
};

function mapValueIndexToDateString(index) {
  if (index >= 0 && index < 17) {
    return `${15+index}.7.`;
  } else {
    return null;
  }
}

