import renderImg from '../common/renderImg';

export default function renderHistoryLeadersPerson(person) {
  return `
    <li class="history-leaders__person chart-leader">
      ${renderImg(person.avatar, person.name, 40, 40, `chart-leader__avatar`)}
      <div class="chart-leader__text">
        <h4 class="chart-leader__name">${person.name}</h4>
        <p class="chart-leader__value caption caption_dim">${person.valueText}</p>
      </div>
    </li>
  `;
}
