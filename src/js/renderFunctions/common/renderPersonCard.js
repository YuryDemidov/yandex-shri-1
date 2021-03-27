import renderImg from './renderImg';

export default function renderPersonCard(personData, position, isSelected, emoji) {
  const lowPositionSelected = isSelected && position > 5;
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
      ${renderImg(personData.avatar, personData.name)}
      <figcaption class="person-card__caption">
        <h3 class="person-card__name">${personData.name}</h3>
        <span class="person-card__result">${personData.valueText}</span>
      </figcaption>
    </figure>
  `;
}
