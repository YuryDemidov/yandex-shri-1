import renderImg from './renderImg';
import { LANDSCAPE_PHONE_MIN_WIDTH } from '../../utils/constants/screenDimensions';

export default function renderPersonCard(personData, position, selectedUserId, emoji, leadersBarsCount) {
  const isSelected = personData.id === selectedUserId;
  const lowPositionSelected = isSelected && position > leadersBarsCount;
  const [name, surname] = personData.name.split(` `);
  let currentEmoji = emoji;

  if (isSelected && position !== 1) {
    currentEmoji = `👍`; // like
  }

  return `
    <figure class="person-card ${
      isSelected ? `person-card_selected` : ``
    } ${
      lowPositionSelected ? `person-card_low-position-selected` : ``
    }">
      ${lowPositionSelected ? `<span class="person-card__low-selected-position">${position}</span>` : ``}
      ${currentEmoji ? `<b class="person-card__emoji">${currentEmoji}</b>` : ``}
      ${renderImg(personData.avatar, personData.name, 64, 64, `person-card__avatar`)}
      <figcaption class="person-card__caption">
        <h3 class="person-card__full-name main-text">
          <span class="person-card__name">${name}</span>
          <span class="person-card__surname">${surname}</span>
        </h3>
        <span class="person-card__result caption caption_dim">${(selectedUserId && globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH) ? personData.valueText : parseInt(personData.valueText)}</span>
      </figcaption>
    </figure>
  `;
}
