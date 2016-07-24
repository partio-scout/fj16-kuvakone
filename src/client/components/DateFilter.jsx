import React from 'react';
import Rheostat from 'rheostat';
import _ from 'lodash';
import { DateLabel } from '../components';

export function DateFilter({ startDate, endDate, onChange }) {
  return (
    <Rheostat
      min={ 0 }
      max={ 16 }
      values={ [ mapDateToDateIndex(startDate), mapDateToDateIndex(endDate) ] }
      snap
      snapPoints={ _.range(0, 17) }
      pitPoints={ _.range(0, 17) }
      pitComponent={ DateLabel }
      onChange={ function({ values }) { onChange(mapDateIndexToDate(values[0]), mapDateIndexToDate(values[1])); } }
    />
  );
}

DateFilter.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  startDate: React.PropTypes.instanceOf(Date),
  endDate: React.PropTypes.instanceOf(Date),
};

function mapDateToDateIndex(date) {
  const dateIndex = date.getDate() - 15;
  if (dateIndex < 0) {
    return 0;
  } else if (dateIndex > 16) {
    return 16;
  } else {
    return dateIndex;
  }
}

function mapDateIndexToDate(index) {
  if (index >= 0 && index < 17) {
    return new Date(`2016-07-${15+index}`);
  } else {
    return null;
  }
}
