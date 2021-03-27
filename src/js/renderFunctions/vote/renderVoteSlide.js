import renderVotingCandidates from './renderVotingCandidates';
import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/landscapePhoneMinWidth';

const LANDSCAPE_CANDIDATES_QUANTITY = 8;
const PORTRAIT_CANDIDATES_QUANTITY = 6;

/**
 * Render vote slide content.
 *
 * @param {SlideData} data - slide data or JSON with data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderVoteSlide(data) {
  const candidatesNumber = globalThis.innerWidth > LANDSCAPE_PHONE_MIN_WIDTH
    ? LANDSCAPE_CANDIDATES_QUANTITY
    : PORTRAIT_CANDIDATES_QUANTITY;
  const offset = data.offset || null;
  const decreasedOffset = offset - candidatesNumber;
  const increasedOffset = offset + candidatesNumber;
  const maxOffset = data.users.length - candidatesNumber;
  const prevOffset = decreasedOffset > 0 ? decreasedOffset : 0;
  const nextOffset = increasedOffset < maxOffset ? increasedOffset : maxOffset;
  const actionParamsPrev = JSON.stringify({
    alias: `vote`,
    data: {
      offset: prevOffset
    }
  });
  const actionParamsNext = JSON.stringify({
    alias: `vote`,
    data: {
      offset: nextOffset
    }
  });
  let currentCandidatesNumber = 0;

  return `
    <div class="voting-layout">
      <button class="voting-layout__button voting-layout__button_prev" type="button" ${
        offset <= 0 ? `disabled` : ``
      } aria-label="Предыдущие кандидаты" data-action="update" data-params=${actionParamsPrev}>
        <svg width="64" height="64" class="inline-icon__icon">
          <use xlink:href="#button"></use>
        </svg>
      </button>
      <ul class="voting-layout__candidates voting-candidates">
        ${data.users.reduce((markup, user, i) => {
          if (offset > i || currentCandidatesNumber >= candidatesNumber) {
            return markup;
          }

          currentCandidatesNumber++;
          markup += renderVotingCandidates(user, data);
          return markup;
        }, ``)}
      </ul>
      <button class="voting-layout__button voting-layout__button_next" type="button" ${
        offset + candidatesNumber >= data.users.length ? `disabled` : ``
      } aria-label="Следующие кандидаты" data-action="update" data-params=${actionParamsNext}>
        <svg width="64" height="64" class="inline-icon__icon">
          <use xlink:href="#button"></use>
        </svg>
      </button>
    </div>  
  `;
}
