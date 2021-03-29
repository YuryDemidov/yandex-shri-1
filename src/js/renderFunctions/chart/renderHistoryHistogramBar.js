export default function renderHistoryHistogramBar(itemValue, maxValue, chartHeight, chartTopGap) {
  const barPercentageHeight = itemValue.value / maxValue - chartTopGap;
  const barHeight = `${(barPercentageHeight * chartHeight).toPrecision(4)}px`;

  return `
    <li class="history-histogram__bar-wrap ${itemValue.active ? `history-histogram__bar-wrap_active` : ``}">
      <h4 class="history-histogram__bar-label">${itemValue.title}</h4>
      <div class="history-histogram__bar" style="height: ${barHeight}" aria-label="Значение: ${itemValue.value}"></div>
      <span class="history-histogram__value" aria-hidden="true">${parseInt(itemValue.value)}</span>
    </li>
  `;
}
