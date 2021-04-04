import processActivityData from './processActivityData';
import renderActivityHeatmap from './renderActivityHeatmap';
import renderActivityTableData from './renderActivityTableData';
import renderActivityChartLegend from './renderActivityChartLegend';

/**
 * Render activity slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderActivitySlide(data) {
  const processedData = processActivityData(data);

  return `
    <figure class="activity-chart">
      <div class="activity-chart__wrap">
        ${renderActivityHeatmap(processedData)}
        ${renderActivityTableData(data)}        
      </div>
      ${renderActivityChartLegend(processedData)}
    </figure>
  `;
}
