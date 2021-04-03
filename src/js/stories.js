import '../../src/scss/stories.scss';

import {
  LANDSCAPE_DEFAULT_WIDTH,
  LANDSCAPE_PHONE_MIN_WIDTH,
  TABLET_MIN_WIDTH
} from './utils/constants/screenDimensions';
import debounce from './utils/functions/debounce';
import renderCaption from './renderFunctions/common/renderCaption';
import renderSlideContent from './renderFunctions/common/renderSlideContent';
import drawCanvasDiagram from './renderFunctions/diagram/drawCanvasDiagram';
import setVhCssProperty from './renderFunctions/common/setVhCssProperty';
import adjustVoteSlideIndents from './renderFunctions/vote/adjustVoteSlidePaddings';

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
 * Post render function for calculations and logic depending on the rendered content
 *
 * @param {SlideType} alias - alias of slide to render.
 * @param {SlideData|string} data - slide data or JSON with data.
 */
globalThis.postRenderScript = function(alias, data) {
  if (!data) {
    return ``;
  }

  if (typeof data === `string`) {
    data = JSON.parse(data);
  }

  switch (alias) {
    case 'vote':
      adjustVoteSlideIndents();
      break;
    case 'diagram':
      drawCanvasDiagram(data);
      break;
    default:
      break;
  }
}

const RESIZE_DEBOUNCE_DELAY = 120; // ms
const debouncedWindowResizeHandler = debounce(windowResizeHandler, RESIZE_DEBOUNCE_DELAY);
setVhCssProperty();
globalThis.addEventListener(`resize`, debouncedWindowResizeHandler);

function renderPage() {
  document.querySelector(`#output`).innerHTML = globalThis.renderTemplate(savedSlideName, savedSlideData);
  globalThis.postRenderScript(savedSlideName, savedSlideData);
}

function windowResizeHandler() {
  if (previousWindowHeight !== globalThis.innerHeight) {
    setVhCssProperty();

    if (document.querySelector(`.slide_vote`)) {
      adjustVoteSlideIndents();
    }

    if (document.querySelector(`.slide_chart`)) {
      renderPage();
    }
  }

  if (isRerenderNecessary()) {
    renderPage();
  }

  previousWindowHeight = globalThis.innerHeight;
  previousWindowWidth = globalThis.innerWidth;
}

function isOrientationChange() {
  return (previousWindowWidth > previousWindowHeight && globalThis.innerWidth < globalThis.innerHeight) || (previousWindowWidth < previousWindowHeight && globalThis.innerWidth > globalThis.innerHeight);
}

function isRerenderThreshold(width) {
  return (previousWindowWidth < width && globalThis.innerWidth >= width) ||
    (previousWindowWidth >= width && globalThis.innerWidth < width);
}

function isRerenderNecessary() {
  return isOrientationChange() || isRerenderThreshold(LANDSCAPE_PHONE_MIN_WIDTH) ||
    isRerenderThreshold(LANDSCAPE_DEFAULT_WIDTH) || isRerenderThreshold(TABLET_MIN_WIDTH);
}
