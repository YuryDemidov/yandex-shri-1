import isLandscape from '../../utils/functions/isLandscape';
import getIntervals from './getIntervals';

export default function renderActivityHeatmap(data) {
  const intervals = getIntervals({ data });

  const svgIconMap = new Map();
  svgIconMap.set([0, 0], `s`);

  [`m`, `l`, `xl`].forEach((iconName, i) => {
    svgIconMap.set(intervals[i], iconName);
  });

  return `
    <div class="heatmap">
      ${Object.keys(data).reduce((dayMarkup, day) => {
        dayMarkup += `
          <div class="heatmap__day-data">
            ${data[day].reduce((hourMarkup, hourValue) => {
              let currentSvgIcon;
              for (const entry of svgIconMap) {
                const interval = entry[0];
                const svgIconSize = entry[1];

                if (hourValue >= interval[0] && hourValue <= interval[1]) {
                  currentSvgIcon = `#bar-${svgIconSize}`;
                  break;
                }
              }
              hourMarkup += `
                <div class=${isLandscape() ? `heatmap__two-hour-data` : `heatmap__hour-data`}>
                  <svg class="heatmap__bar heatmap__${currentSvgIcon.slice(1).replace(`-`, `_`)}">
                    <use xlink:href=${currentSvgIcon}></use>
                  </svg>
                </div>
              `;
              return hourMarkup;
            }, ``)}
          </div>
        `
        return dayMarkup;
      }, ``)}
    </div>
  `;
}
