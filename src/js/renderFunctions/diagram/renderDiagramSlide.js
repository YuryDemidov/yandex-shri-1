import renderDiagramDescription from './renderDiagramDescription';

/**
 * @typedef Category
 * @type {Object}
 * @property {string} title - title of the category.
 * @property {string} valueText - string with some value consisting of the number and optionally of the string.
 * @property {string} differenceText - difference between current and previous periods for this category.
 */

/**
 * Render diagram slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderDiagramSlide(data) {
  return `
    <figure class="diagram">
      <h3 class="visually-hidden">Кольцевая диаграмма</h3>
      <div class="diagram__wrap">
        <div class="diagram__main-description">
          <p class="diagram__total headline">${data.totalText}</p>
          <p class="diagram__difference subhead subhead_dim">${data.differenceText}</p>
        </div>
        <div class="diagram__doughnut-wrap">
          <canvas id="doughnutDiagram" class="diagram__canvas" width="400" height="400"></canvas>
        </div>
      </div>
      ${renderDiagramDescription(data)}
    </figure>
  `;
}
