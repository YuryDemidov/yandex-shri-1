import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/screenDimensions';
import getIntervals from './getIntervals';

export default function renderActivityHeatmap(data) {
  const intervals = getIntervals({ data });
  const svgIconMap = new Map();
  svgIconMap.set([0, 0], `bar-s`);
  [`bar-m`, `bar-l`, `bar-xl`].forEach((iconName, i) => {
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
                const svgIconName = entry[1];

                if (hourValue >= interval[0] && hourValue <= interval[1]) {
                  currentSvgIcon = `#${svgIconName}`;
                  break;
                }
              }
              hourMarkup += `
                <div class=${globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH ? `heatmap__hour-data` : `heatmap__two-hour-data`}>
                  <svg>
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
