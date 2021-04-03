export default function renderHistoryHistogramBar(itemValue, maxValue, chartHeight) {
  const barPercentageHeight = itemValue.value / maxValue;
  const barHeight = `${(barPercentageHeight * chartHeight).toPrecision(4)}px`;
  const value = parseInt(itemValue.value);

  return `
    <li class="history-histogram__bar-wrap ${itemValue.active ? `history-histogram__bar-wrap_active` : ``}">
      <h4 class="history-histogram__bar-label main-text main-text_dim">${itemValue.title}</h4>
      <div class="history-histogram__bar column-bar ${itemValue.active ? `column-bar_active` : ``}" style="height: ${barHeight}" aria-label="Значение: ${itemValue.value}"></div>
      <span class="history-histogram__value subhead subhead_dim" aria-hidden="true">${value || ''}</span>
    </li>
  `;
}
