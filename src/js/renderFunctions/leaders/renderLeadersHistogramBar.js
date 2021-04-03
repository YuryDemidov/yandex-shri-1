import renderPersonCard from '../common/renderPersonCard';

let selectedRendered = false;

export default function renderLeadersHistogramBar(person, index, slideData, barsCount) {
  const isSelectedUser = person.id === slideData.selectedUserId;
  if ((!isSelectedUser && index > 4) || (slideData.selectedUserId && index === 4 && slideData.selectedUserId !== person.id && !selectedRendered)) {
    return ``;
  }

  if (isSelectedUser) {
    selectedRendered = true;
  }

  return `
    <li class="leaders-histogram__bar-wrap ${isSelectedUser && index + 1 > barsCount ? `leaders-histogram__bar-wrap_no-number` : ``}">
      ${renderPersonCard(person, index + 1, slideData.selectedUserId, index === 0 && slideData.emoji, barsCount)}
      <div class="leaders-histogram__bar column-bar column-bar_wide ${index === 0 ? `leaders-histogram__bar_first column-bar_active` : ``}"></div>
    </li>
  `;
}
