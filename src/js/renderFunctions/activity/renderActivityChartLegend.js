import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/screenDimensions';
import getIntervals from './getIntervals';

export default function renderActivityChartLegend(data) {
  const intervals = getIntervals({ data });

  return `
    <figcaption class="activity-chart__legend activity-legend">
      <ul class="activity-legend__categories">
        <li class="activity-legend__scale">
          ${globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH ? `1 час` : `2 часа`}
        </li>
        <li class="activity-legend__category activity-legend__category_0">
          <span class="activity-legend__bar"></span>
          <span class="activity-legend__value">0</span>
        </li>
        ${intervals.reduce((markup, interval, i) => {
          markup += `
            <li class="activity-legend__category activity-legend__category_${i + 1}">
              <span class="activity-legend__bar"></span>
              <span class="activity-legend__value">${interval[0]} — ${interval[1]}</span>
            </li>
          `;
          return markup;
        }, ``)}
      </ul>
    </figcaption>
  `;
}
