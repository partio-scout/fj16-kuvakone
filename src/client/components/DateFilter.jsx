import React from 'react';
import Rheostat from 'rheostat';
import _ from 'lodash';
import { getDateLabel } from '../components';
import { mapDateIndexToDate, mapDateToDateIndex } from '../utils';

export function DateFilter({ selectedStartDate, selectedEndDate, onChange, startDate, dayCount }) {
  const DateLabel = getDateLabel(startDate, dayCount);
  return (
    <Rheostat
      min={ 0 }
      max={ dayCount }
      values={ [ _mapDateToDateIndex(selectedStartDate), _mapDateToDateIndex(selectedEndDate) ] }
      snap
      snapPoints={ _.range(0, dayCount + 1) }
      pitPoints={ _.range(0, dayCount + 1) }
      pitComponent={ DateLabel }
      onChange={ function({ values }) { onChange(_mapDateIndexToDate(values[0]), _mapDateIndexToDate(values[1])); } }
    />
  );

  function _mapDateToDateIndex(date) {
    mapDateToDateIndex(date, dayCount);
  }

  function _mapDateIndexToDate(index) {
    return mapDateIndexToDate(index, startDate, dayCount);
  }
}

DateFilter.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  selectedStartDate: React.PropTypes.instanceOf(Date).isRequired,
  selectedEndDate: React.PropTypes.instanceOf(Date).isRequired,
  startDate: React.PropTypes.instanceOf(Date).isRequired,
  dayCount: React.PropTypes.number.isRequired,
};
