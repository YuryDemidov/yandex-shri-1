import renderLeadersHistogramBar from './renderLeadersHistogramBar';

/**
 * Render leaders slide content.
 *
 * @param {SlideData} data - slide data or JSON with data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderLeadersSlide(data) {
  return `
<ol class="leaders-histogram">
  ${data.users.reduce((markup, user, i) => {
    markup += renderLeadersHistogramBar(user, i, data);
    return markup;
  }, ``)}
</ol>  
`;
}
