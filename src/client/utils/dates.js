const dayMs = 86400000;

export function addDays(originalDate, daysToAdd) {
  const originalDateEpochMs = originalDate.getTime();
  const resultMs = daysToAdd * dayMs + originalDateEpochMs;
  return new Date(resultMs);
}

export function mapDateIndexToDate(index, startDate, dayCount) {
  if (index >= 0 && index < (dayCount + 1)) {
    return addDays(startDate, index);
  } else {
    return null;
  }
}

export function mapDateToDateIndex(date, dayCount) {
  const dateIndex = date.getDate() - (dayCount - 1);
  if (dateIndex < 0) {
    return 0;
  } else if (dateIndex > dayCount) {
    return dayCount;
  } else {
    return dateIndex;
  }
}
