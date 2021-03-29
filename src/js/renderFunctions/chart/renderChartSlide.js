import renderHistoryHistogramBar from './renderHistoryHistogramBar';
import renderHistoryLeadersPerson from './renderHistoryLeadersPerson';
import { LANDSCAPE_DEFAULT_WIDTH, PORTRAIT_DEFAULT_WIDTH } from '../../utils/constants/screenDimensions';

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
  const isLandscape = globalThis.innerWidth > globalThis.innerHeight;
  const CHART_HEIGHT_RATIO = isLandscape ? 130 / PORTRAIT_DEFAULT_WIDTH : 300 / LANDSCAPE_DEFAULT_WIDTH;
  const CHART_TOP_GAP = 0.1; // 10% of space will not be used for drawing bars
  const chartHeight = (globalThis.innerHeight * CHART_HEIGHT_RATIO).toPrecision(4);
  const maxValue = data.values.reduce((max, dataValue) => {
    return max < dataValue.value ? dataValue.value : max;
  }, 0);

  return `
    <div class="history-histogram-wrap">
      <section class="history-histogram">
        <h3 class="visually-hidden">Диаграмма</h3>
        <ul class="history-histogram__chart" style="height: ${chartHeight + `px`}">
          ${data.values.reduce((markup, value) => {
            markup += renderHistoryHistogramBar(value, maxValue, chartHeight, CHART_TOP_GAP);
            return markup;
          }, ``)}
        </ul>
      </section>
      <section class="history-leaders">
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
