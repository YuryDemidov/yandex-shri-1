import isLandscape from '../../utils/functions/isLandscape';

export default function processActivityData({ data }) {
  if (!isLandscape()) {
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
