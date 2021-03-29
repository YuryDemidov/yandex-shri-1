import integerDivision from '../../utils/functions/integerDivision';

export default function getIntervals({ data }) {
  const CALCULATED_INTERVALS_COUNT = 3;

  let currentMaxValue = +Object.values(data).reduce((max, dayValues) => {
    let dayMax = 0;
    for (let i = 0; i < dayValues.length; i++) {
      if (dayValues[i] > dayMax) {
        dayMax = dayValues[i];
      }
    }
    return dayMax > max ? dayMax : max;
  }, 0);

  const intervals = [];
  const interval = integerDivision(currentMaxValue, CALCULATED_INTERVALS_COUNT);
  let reminder = currentMaxValue - interval * CALCULATED_INTERVALS_COUNT;

  for (let i = 0; i < CALCULATED_INTERVALS_COUNT; i++) {
    const intervalMaximum = currentMaxValue;
    currentMaxValue -= interval;
    if (reminder) {
      currentMaxValue--;
      reminder--;
    }

    intervals.push([currentMaxValue + 1, intervalMaximum]);
  }

  return intervals.reverse();
}
