import isLandscape from '../../utils/functions/isLandscape';
import getIntervals from './getIntervals';

export default function renderActivityChartLegend(data) {
  const intervals = getIntervals({ data });

  return `
    <figcaption class="activity-chart__legend activity-legend">
      <ul class="activity-legend__categories">
        <li class="activity-legend__category activity-legend__category_scale">
          <span class="activity-legend__scale-line"></span>
          <span class="activity-legend__value main-text main-text_dim">${isLandscape() ? `2 часа` : `1 час`}</span>
        </li>
        <li class="activity-legend__category activity-legend__category_0">
          <span class="activity-legend__bar"></span>
          <span class="activity-legend__value main-text main-text_dim">0</span>
        </li>
        ${intervals.reduce((markup, interval, i) => {
          markup += `
            <li class="activity-legend__category activity-legend__category_${i + 1}">
              <span class="activity-legend__bar"></span>
              <span class="activity-legend__value main-text main-text_dim">${
                interval[0] === interval[1] ? interval[0] : `${interval[0]} — ${interval[1]}`
              }</span>
            </li>
          `;
          return markup;
        }, ``)}
      </ul>
    </figcaption>
  `;
}
