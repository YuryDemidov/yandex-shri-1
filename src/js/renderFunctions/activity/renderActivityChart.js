import renderActivityHeatmap from './renderActivityHeatmap';
import renderActivityTableData from './renderActivityTableData';
import renderActivityChartLegend from './renderActivityChartLegend';
import processActivityData from './processActivityData';

export default function renderActivityChart(data) {
  const processedData = processActivityData(data);
  return `
    <figure class="activity-chart__wrap">
      ${renderActivityHeatmap(processedData)}
      ${renderActivityTableData(data)}
      ${renderActivityChartLegend(processedData)}
    </figure>
  `;
}
