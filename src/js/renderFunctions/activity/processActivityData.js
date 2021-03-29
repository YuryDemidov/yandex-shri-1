import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/screenDimensions';

export default function processActivityData({ data }) {
  if (globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH) {
    return data;
  }

  const processedData = {};

  Object.keys(data).forEach((day) => {
    data[day].forEach((hourValue, hour) => {
      processedData[day] = processedData[day] || [];
      if (hour % 2 === 0) {
        processedData[day].push(hourValue + data[day][hour + 1])
      }
    });
  });

  return processedData;
}
