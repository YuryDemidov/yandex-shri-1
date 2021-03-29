import renderImg from '../common/renderImg';

export default function renderHistoryLeadersPerson(person) {
  return `
    <li class="history-leaders__person chart-leader">
      ${renderImg(person.avatar, person.name)}
      <div class="chart-leader__text">
        <h4 class="chart-leader__name">${person.name}</h4>
        <p class="chart-leader__value">${person.valueText}</p>
      </div>
    </li>
  `;
}
