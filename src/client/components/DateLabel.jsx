import React from 'react';
import { mapDateIndexToDate } from '../utils';

export function getDateLabel(startDate, dayCount) {
  function DateLabel({ children, style }) {
    const date = mapDateIndexToDate(children, startDate, dayCount);
    const formattedDate = date === null
      ? null
      : `${date.getDate()}.${date.getMonth() + 1}.`;

    return (
      <div style={ style }>
        {
          formattedDate
        }
      </div>
    );
  }

  DateLabel.propTypes = {
    children: React.PropTypes.number,
    style: React.PropTypes.object,
  };

  return DateLabel;
}
