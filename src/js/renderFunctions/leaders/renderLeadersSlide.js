import renderLeadersHistogramBar from './renderLeadersHistogramBar';
import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/screenDimensions';

/**
 * Render leaders slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderLeadersSlide(data) {
  const barsCount = globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH ? 3 : 5;
  return `
<ol class="leaders-histogram">
  ${data.users.reduce((markup, user, i) => {
    markup += renderLeadersHistogramBar(user, i, data, barsCount);
    return markup;
  }, ``)}
</ol>  
`;
}
