function renderActivityCells({ data }) {
  const DAY_HOURS = 24;
  let tableBody = ``;

  for (let hour = 0; hour < DAY_HOURS; hour++) {
    tableBody += `
      <tr>
        <th>${hour}:00 - ${hour + 1}:00</th>
    `;
    for (const day of Object.keys(data)) {
      tableBody += `
        <td>${data[day][hour]}</td>
      `;
    }
    tableBody += `</tr>`;
  }

  return tableBody;
}

export default function renderActivityTableData(data) {
  return `
    <div class="visually-hidden">
      <table aria-label="Данные с графика активности в различные часы">
        <thead>
          <tr>
            <th>Временной интервал</th>
            <th>Понедельник</th>
            <th>Вторник</th>
            <th>Среда</th>
            <th>Четверг</th>
            <th>Пятница</th>
            <th>Суббота</th>
            <th>Воскресенье</th>
          </tr>
        </thead>
        <tbody>
          ${renderActivityCells(data)}
        </tbody>
      </table>
    </div>
  `;
}
