import renderVotingCandidates from './renderVotingCandidates';
import { LANDSCAPE_DEFAULT_WIDTH, TABLET_MIN_WIDTH } from '../../utils/constants/screenDimensions';

const LANDSCAPE_CANDIDATES_QUANTITY = 6;
const PORTRAIT_CANDIDATES_QUANTITY = 8;
const TABLET_CANDIDATES_QUANTITY = 10;

/**
 * Render vote slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
export default function renderVoteSlide(data) {
  let candidatesNumber;
  if (globalThis.innerWidth < LANDSCAPE_DEFAULT_WIDTH) {
    candidatesNumber = PORTRAIT_CANDIDATES_QUANTITY;
  } else if (globalThis.innerWidth >= LANDSCAPE_DEFAULT_WIDTH && globalThis.innerWidth < TABLET_MIN_WIDTH) {
    candidatesNumber = LANDSCAPE_CANDIDATES_QUANTITY;
  } else {
    candidatesNumber = TABLET_CANDIDATES_QUANTITY;
  }

  let offset = data.offset || 0;
  const decreasedOffset = offset - candidatesNumber;
  const increasedOffset = offset + candidatesNumber;
  const maxOffset = data.users.length - candidatesNumber;
  offset = offset > maxOffset ? maxOffset : offset;
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

          markup += renderVotingCandidates(user, data, currentCandidatesNumber);
          currentCandidatesNumber++;
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
