import renderLeadersSlide from '../leaders/renderLeadersSlide';
import renderVoteSlide from '../vote/renderVoteSlide';
import renderActivitySlide from '../activity/renderActivitySlide';
import renderChartSlide from '../chart/renderChartSlide';
import renderDiagramSlide from '../diagram/renderDiagramSlide';

/**
 * @typedef {'leaders' | 'vote' | 'activity' | 'chart' | 'diagram'} SlideType
 */

/**
 * Render content of the slide of the required type.
 *
 * @param {SlideType} slideType - alias of slide to render.
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup with slide content.
 */
export default function renderSlideContent(slideType, data) {
  switch (slideType) {
    case 'leaders':
      return renderLeadersSlide(data);
    case 'vote':
      return renderVoteSlide(data);
    case 'activity':
      return renderActivitySlide(data);
    case 'chart':
      return renderChartSlide(data);
    case 'diagram':
      return renderDiagramSlide(data);
  }
}
