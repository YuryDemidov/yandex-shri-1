import {
  LANDSCAPE_DEFAULT_WIDTH,
  PORTRAIT_DEFAULT_WIDTH
} from '../../utils/constants/screenDimensions';
import isLandscape from '../../utils/functions/isLandscape';
import renderHistoryHistogramBar from './renderHistoryHistogramBar';
import renderHistoryLeadersPerson from './renderHistoryLeadersPerson';

/**
 * @typedef HistoryValue
 * @type {Object}
 * @property {string} title - title of time period.
 * @property {number} value - value for period.
 * @property {boolean} active - true if period is active else false.
 */

/**
 * Render chart slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderChartSlide(data) {
  const fullChartHeightRatio = isLandscape() ? 185 / PORTRAIT_DEFAULT_WIDTH : 403 / LANDSCAPE_DEFAULT_WIDTH;
  const maxBarHeightRatio = isLandscape() ? 117 / PORTRAIT_DEFAULT_WIDTH : 270 / LANDSCAPE_DEFAULT_WIDTH;

  const fullChartHeight = (fullChartHeightRatio * globalThis.innerHeight).toPrecision(5);
  const chartHeight = maxBarHeightRatio * globalThis.innerHeight;
  const maxValue = data.values.reduce((max, dataValue) => {
    return max < dataValue.value ? dataValue.value : max;
  }, 0);

  return `
    <div class="chart-slide">
      <section class="history-histogram chart-slide__histogram">
        <h3 class="visually-hidden">Диаграмма</h3>
        <div class="history-histogram__chart" style="height: ${fullChartHeight + `px`}">
          <ul class="history-histogram__values">
            ${data.values.reduce((markup, value) => {
              markup += renderHistoryHistogramBar(value, maxValue, chartHeight);
              return markup;
            }, ``)}
          </ul>
        </div>
      </section>
      <section class="history-leaders chart-slide__leaders">
        <h3 class="visually-hidden">Лидеры</h3>
        <ul class="history-leaders__list">
          ${data.users.reduce((markup, user, i) => {
            if (i < 2) {
              markup += renderHistoryLeadersPerson(user);
            }
            return markup;
          }, ``)}
        </ul>
      </section>
    </div>
  `;
}
