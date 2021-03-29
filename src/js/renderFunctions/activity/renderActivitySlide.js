import renderActivityChart from './renderActivityChart';

/**
 * Render activity slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderActivitySlide(data) {
  return `
    <div class="activity-chart">
      ${renderActivityChart(data)}
    </div>
  `;
}
