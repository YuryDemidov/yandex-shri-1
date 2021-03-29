import '../../src/scss/stories.scss';

import renderCaption from './renderFunctions/common/renderCaption';
import renderSlideContent from './renderFunctions/common/renderSlideContent';
import drawDiagram from './renderFunctions/diagram/drawDiagram';
import setVhCssProperty from './renderFunctions/common/setVhCssProperty';
import debounce from './utils/functions/debounce';

let previousWindowWidth = globalThis.innerWidth;
let previousWindowHeight = globalThis.innerHeight;
let savedSlideName;
let savedSlideData;

if (module.hot) {
  module.hot.accept();
}

/**
 * @typedef SlideData
 * @type {Object|string}
 * @property {string} title - slide title.
 * @property {string} subtitle - slide subtitle (sprint number).
 * @property {string} emoji - emoji for design goals.
 * @property {number} [selectedUserId] - id of voted person.
 * @property {number} [offset] - index of the person to be displayed first.
 * @property {HistoryValue[]} [values] - history chart values.
 * @property {string} [totalText] - total value of diagram representation.
 * @property {string} [differenceText] - description of the difference between current and previous values.
 * @property {Category[]} [categories] - categories for diagram representation.
 * @property {Object} [data] - activity data ordered by day of the week with array with 24 values corresponding to the hours.
 * @property {Person[]} users - ordered list of teammates.
 */

/**
 * @typedef Person
 * @type {Object}
 * @property {number} id - person id.
 * @property {string} name - person full name.
 * @property {string} avatar - name of image file with person photo.
 * @property {string} valueText - string with some value consisting of the number and optionally of the string.
 */

/**
 * Main render function.
 *
 * @param {SlideType} alias - alias of slide to render.
 * @param {SlideData|string} data - slide data or JSON with data.
 *
 * @returns {string} - markup for page rendering or empty string if there is no such slide type or data was not provided.
 */
globalThis.renderTemplate = function(alias, data) {
  if (!alias || !data) {
    return ``;
  }

  if (typeof data === `string`) {
    data = JSON.parse(data);
  }

  savedSlideName = alias;
  savedSlideData = data;

  return `
    <main class="slide slide_${alias}">
      ${renderCaption(data)}
      <div class="slide__content">
        ${renderSlideContent(alias, data)}
      </div>
    </main>
  `;
}

/**
 * Draws doughnut diagram on canvas
 *
 * @param {SlideData} slideData - standard slide data for diagram slides.
 */
globalThis.drawCanvasDiagram = function(slideData) {
  if (typeof slideData === `string`) {
    slideData = JSON.parse(slideData);
  }

  drawDiagram(slideData);
}

const RESIZE_DEBOUNCE_DELAY = 100; // ms
const debouncedWindowResizeHandler = debounce(windowResizeHandler, RESIZE_DEBOUNCE_DELAY);
setVhCssProperty();
globalThis.addEventListener(`resize`, debouncedWindowResizeHandler);

function windowResizeHandler() {
  if (previousWindowHeight !== globalThis.innerHeight) {
    setVhCssProperty();
  }

  if (isOrientationChange()) {
    document.querySelector(`#output`).innerHTML = globalThis.renderTemplate(savedSlideName, savedSlideData);
  }

  previousWindowHeight = globalThis.innerHeight;
  previousWindowWidth = globalThis.innerWidth;
}

function isOrientationChange() {
  return (previousWindowWidth > previousWindowHeight && globalThis.innerWidth < globalThis.innerHeight) || (previousWindowWidth < previousWindowHeight && globalThis.innerWidth > globalThis.innerHeight);
}
