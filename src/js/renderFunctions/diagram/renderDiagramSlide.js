import renderDiagram from './renderDiagram';

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
    <div class="diagram-wrap">
      ${renderDiagram(data)}
    </div>
  `;
}
