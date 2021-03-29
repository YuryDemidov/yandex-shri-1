import renderDiagramDescription from './renderDiagramDescription';

export default function renderDiagram(data) {
  return `
    <figure class="diagram">
      <h3 class="visually-hidden">Кольцевая диаграмма</h3>
      <div class="diagram__main-description">
        <p class="diagram__total">${data.totalText}</p>
        <p class="diagram__difference">${data.differenceText}</p>
      </div>
      <canvas id="doughnutDiagram" width="328" height="328" style="transform: rotate(240deg)"></canvas>
      ${renderDiagramDescription(data)}
    </figure>
  `;
}
