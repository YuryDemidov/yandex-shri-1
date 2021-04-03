export default function renderDiagramDescription(data) {
  return `
    <figcaption class="diagram__description description-table">
      <table class="description-table__table" aria-label="Таблица с данными, отображёнными на круговой диаграмме">
        <thead class="visually-hidden">
          <tr>
            <th>Обозначение на диаграмме</th>
            <th>${data.title}</th>
            <th>Разница, по сравнению с предыдущим значением</th>
            <th>Текущее значение</th>
          </tr>
        </thead>
        <tbody>
          ${data.categories.reduce((markup, category, i) => {
            markup += `
              <tr>
                <td><span class="description-table__category-color description-table__category-color_${i + 1}"></span></td>
                <td class="description-table__category">${category.title}</td>
                <td>+${parseInt(category.differenceText)}</td>
                <td>${parseInt(category.valueText)}</td>
              </tr>
            `;
            return markup;
          }, ``)}
        </tbody>
      </table>
    </figcaption>
  `;
}
