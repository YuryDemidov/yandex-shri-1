import renderPersonCard from '../common/renderPersonCard';

export default function renderLeadersHistogramBar(person, index, slideData) {
  const isSelectedUser = index === slideData.selectedUserId;
  if ((!isSelectedUser && index > 4) || (slideData.selectedUserId && index === 4)) {
    return ``;
  }

  return `
    <li class="leaders-histogram__bar-wrap">
      ${renderPersonCard(person, index + 1, isSelectedUser, index === 0 && slideData.emoji)}
      <div class="leaders-histogram__bar ${index === 0 ? `leaders-histogram__bar_first` : ``}"></div>
    </li>
  `;
}
