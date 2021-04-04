// Warning!
// This is not the file you are looking for!
// This file was created manually only for possibility to autotest it

const TABLET_MIN_WIDTH = 768; // px
const LANDSCAPE_DEFAULT_WIDTH = 668; // px
const LANDSCAPE_PHONE_MIN_WIDTH = 576; // px
const PORTRAIT_DEFAULT_WIDTH = 376; // px

function isLandscape() {
  return globalThis.innerWidth > globalThis.innerHeight;
}

function integerDivision(value, divider) {
  return (value - value % divider) / divider;
}

function setVhCssProperty() {
  document.documentElement.style.setProperty(`--vh`, `${globalThis.innerHeight * 0.01}px`);
}

function debounce(func, ms, immediate) {
  let timeout;
  return function() {
    const context = this
    const args = arguments;
    const delayedFunc = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(delayedFunc, ms);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function renderCaption({ title, subtitle }) {
  return `
    <div class="slide__caption">
      <h1 class="slide__title headline">${title}</h1>
      <h2 class="slide__subtitle main-text main-text_dim">${subtitle}</h2>
    </div>
  `;
}

function renderImg(fileName, alt, width, height, className) {
  return `
    <img ${className ? `class=${className}` : ``} srcset="assets/images/1x/${fileName},
      assets/images/2x/${fileName} 2x,
      assets/images/3x/${fileName} 3x,
      assets/images/4x/${fileName} 4x"
      src="assets/images/3x/${fileName}" width="${width}" height="${height}" alt="${alt}">
  `;
}

function renderPersonCard(personData, position, selectedUserId, emoji, leadersBarsCount) {
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

/**
 * Render leaders slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
function renderLeadersSlide(data) {
  const barsCount = globalThis.innerWidth < LANDSCAPE_PHONE_MIN_WIDTH ? 3 : 5;
  return `
    <ol class="leaders-histogram">
      ${data.users.reduce((markup, user, i) => {
    markup += renderLeadersHistogramBar(user, i, data, barsCount);
    return markup;
  }, ``)}
    </ol>  
  `;
}

let selectedRendered = false;
function renderLeadersHistogramBar(person, index, slideData, barsCount) {
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

function adjustVoteSlideIndents() {
  if (globalThis.innerWidth >= LANDSCAPE_DEFAULT_WIDTH) {
    return;
  }

  const votingWrap = document.querySelector(`.voting-layout`);
  const prevButton = document.querySelector(`.voting-layout__button_prev`);
  const nextButton = document.querySelector(`.voting-layout__button_next`);
  const firstPerson = votingWrap.querySelector(`.voting-layout__person_1`);
  const secondPerson = votingWrap.querySelector(`.voting-layout__person_2`);
  const thirdPerson = votingWrap.querySelector(`.voting-layout__person_3`);
  const fifthPerson = votingWrap.querySelector(`.voting-layout__person_5`);
  const seventhPerson = votingWrap.querySelector(`.voting-layout__person_7`);
  const eighthPerson = votingWrap.querySelector(`.voting-layout__person_8`);
  const bigShift = firstPerson.offsetTop.toPrecision(3);
  const smallShift = ((votingWrap.clientHeight - prevButton.clientHeight * 2 - secondPerson.clientHeight * 2) / 5).toPrecision(3);

  prevButton.style.top = `${smallShift}px`;
  nextButton.style.bottom = `${smallShift}px`;
  firstPerson.style.marginTop = `${bigShift}px`;
  secondPerson.style.transform = `translateY(${2 * smallShift + prevButton.clientHeight}px)`;
  thirdPerson.style.marginTop = `${bigShift}px`;
  fifthPerson.style.transform = `translateY(-${2 * smallShift + nextButton.clientHeight}px)`;
  if (eighthPerson) {
    seventhPerson.style.marginBottom = `${bigShift}px`;
    eighthPerson.style.marginBottom = `${bigShift}px`;
  }
}

const LANDSCAPE_CANDIDATES_QUANTITY = 6;
const PORTRAIT_CANDIDATES_QUANTITY = 8;
const TABLET_CANDIDATES_QUANTITY = 10;
/**
 * Render vote slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
function renderVoteSlide(data) {
  let candidatesNumber;
  if (globalThis.innerWidth < LANDSCAPE_DEFAULT_WIDTH) {
    candidatesNumber = PORTRAIT_CANDIDATES_QUANTITY;
  } else if (globalThis.innerWidth >= LANDSCAPE_DEFAULT_WIDTH && globalThis.innerWidth < TABLET_MIN_WIDTH) {
    candidatesNumber = LANDSCAPE_CANDIDATES_QUANTITY;
  } else {
    candidatesNumber = TABLET_CANDIDATES_QUANTITY;
  }

  let offset = data.offset || 0;
  const decreasedOffset = offset - candidatesNumber;
  const increasedOffset = offset + candidatesNumber;
  const maxOffset = data.users.length - candidatesNumber;
  offset = offset > maxOffset ? maxOffset : offset;
  const prevOffset = decreasedOffset > 0 ? decreasedOffset : 0;
  const nextOffset = increasedOffset < maxOffset ? increasedOffset : maxOffset;
  const actionParamsPrev = JSON.stringify({
    alias: `vote`,
    data: {
      offset: prevOffset
    }
  });
  const actionParamsNext = JSON.stringify({
    alias: `vote`,
    data: {
      offset: nextOffset
    }
  });
  let currentCandidatesNumber = 0;

  return `
    <div class="voting-layout">
      <button class="voting-layout__button voting-layout__button_prev" type="button" ${
    offset <= 0 ? `disabled` : ``
  } aria-label="Предыдущие кандидаты" data-action="update" data-params=${actionParamsPrev}>
        <svg width="64" height="64" class="inline-icon__icon">
          <use xlink:href="#button"></use>
        </svg>
      </button>
      <ul class="voting-layout__candidates voting-candidates">
        ${data.users.reduce((markup, user, i) => {
    if (offset > i || currentCandidatesNumber >= candidatesNumber) {
      return markup;
    }

    markup += renderVotingCandidates(user, data, currentCandidatesNumber);
    currentCandidatesNumber++;
    return markup;
  }, ``)}
      </ul>
      <button class="voting-layout__button voting-layout__button_next" type="button" ${
    offset + candidatesNumber >= data.users.length ? `disabled` : ``
  } aria-label="Следующие кандидаты" data-action="update" data-params=${actionParamsNext}>
        <svg width="64" height="64" class="inline-icon__icon">
          <use xlink:href="#button"></use>
        </svg>
      </button>
    </div>  
  `;
}

function renderVotingCandidates(person, slideData, index) {
  const actionParams = JSON.stringify({
    alias: `leaders`,
    data: {
      selectedUserId: person.id
    }
  });

  return `
    <li class="voting-layout__person voting-layout__person_${index + 1}">
      <a class="voting-layout__candidate-link" href="#" data-action="update" data-params=${actionParams}>
        ${renderPersonCard(person, null, slideData.selectedUserId, null)}
      </a>
    </li>
  `;
}

function processActivityData({ data }) {
  if (!isLandscape()) {
    return data;
  }

  const processedData = {};

  Object.keys(data).forEach((day) => {
    data[day].forEach((hourValue, hour) => {
      processedData[day] = processedData[day] || [];
      if (hour % 2 === 0) {
        processedData[day].push(hourValue + data[day][hour + 1])
      }
    });
  });

  return processedData;
}

function getIntervals({ data }) {
  const CALCULATED_INTERVALS_COUNT = 3;

  let currentMaxValue = +Object.values(data).reduce((max, dayValues) => {
    let dayMax = 0;
    for (let i = 0; i < dayValues.length; i++) {
      if (dayValues[i] > dayMax) {
        dayMax = dayValues[i];
      }
    }
    return dayMax > max ? dayMax : max;
  }, 0);

  const intervals = [];
  const interval = integerDivision(currentMaxValue, CALCULATED_INTERVALS_COUNT);
  let reminder = currentMaxValue - interval * CALCULATED_INTERVALS_COUNT;

  for (let i = 0; i < CALCULATED_INTERVALS_COUNT; i++) {
    const intervalMaximum = currentMaxValue;
    currentMaxValue -= interval;
    if (reminder) {
      currentMaxValue--;
      reminder--;
    }

    intervals.push([currentMaxValue + 1, intervalMaximum]);
  }

  return intervals.reverse();
}

function renderActivityHeatmap(data) {
  const intervals = getIntervals({ data });

  const svgIconMap = new Map();
  svgIconMap.set([0, 0], `s`);

  [`m`, `l`, `xl`].forEach((iconName, i) => {
    svgIconMap.set(intervals[i], iconName);
  });

  return `
    <div class="heatmap">
      ${Object.keys(data).reduce((dayMarkup, day) => {
    dayMarkup += `
          <div class="heatmap__day-data">
            ${data[day].reduce((hourMarkup, hourValue) => {
      let currentSvgIcon;
      for (const entry of svgIconMap) {
        const interval = entry[0];
        const svgIconSize = entry[1];

        if (hourValue >= interval[0] && hourValue <= interval[1]) {
          currentSvgIcon = `#bar-${svgIconSize}`;
          break;
        }
      }
      hourMarkup += `
                <div class=${isLandscape() ? `heatmap__two-hour-data` : `heatmap__hour-data`}>
                  <svg class="heatmap__bar heatmap__${currentSvgIcon.slice(1).replace(`-`, `_`)}">
                    <use xlink:href=${currentSvgIcon}></use>
                  </svg>
                </div>
              `;
      return hourMarkup;
    }, ``)}
          </div>
        `
    return dayMarkup;
  }, ``)}
    </div>
  `;
}

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

function renderActivityTableData(data) {
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

function renderActivityChartLegend(data) {
  const intervals = getIntervals({ data });

  return `
    <figcaption class="activity-chart__legend activity-legend">
      <ul class="activity-legend__categories">
        <li class="activity-legend__category activity-legend__category_scale">
          <span class="activity-legend__scale-line"></span>
          <span class="activity-legend__value main-text main-text_dim">${isLandscape() ? `2 часа` : `1 час`}</span>
        </li>
        <li class="activity-legend__category activity-legend__category_0">
          <span class="activity-legend__bar"></span>
          <span class="activity-legend__value main-text main-text_dim">0</span>
        </li>
        ${intervals.reduce((markup, interval, i) => {
    markup += `
            <li class="activity-legend__category activity-legend__category_${i + 1}">
              <span class="activity-legend__bar"></span>
              <span class="activity-legend__value main-text main-text_dim">${
      interval[0] === interval[1] ? interval[0] : `${interval[0]} — ${interval[1]}`
    }</span>
            </li>
          `;
    return markup;
  }, ``)}
      </ul>
    </figcaption>
  `;
}

function renderActivitySlide(data) {
  const processedData = processActivityData(data);

  return `
    <figure class="activity-chart">
      <div class="activity-chart__wrap">
        ${renderActivityHeatmap(processedData)}
        ${renderActivityTableData(data)}        
      </div>
      ${renderActivityChartLegend(processedData)}
    </figure>
  `;
}

function renderHistoryHistogramBar(itemValue, maxValue, chartHeight) {
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

function renderHistoryLeadersPerson(person) {
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

/**
 * @typedef HistoryValue
 * @type {Object}
 * @property {string} title - title of time period.
 * @property {number} value - value for period.
 * @property {boolean} active - true if period is active else false.
 */

/**
 * Render chart slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
function renderChartSlide(data) {
  const fullChartHeightRatio = isLandscape() ? 185 / PORTRAIT_DEFAULT_WIDTH : 403 / LANDSCAPE_DEFAULT_WIDTH;
  const maxBarHeightRatio = isLandscape() ? 117 / PORTRAIT_DEFAULT_WIDTH : 270 / LANDSCAPE_DEFAULT_WIDTH;

  const fullChartHeight = (fullChartHeightRatio * globalThis.innerHeight).toPrecision(5);
  const chartHeight = maxBarHeightRatio * globalThis.innerHeight;
  const maxValue = data.values.reduce((max, dataValue) => {
    return max < dataValue.value ? dataValue.value : max;
  }, 0);

  return `
    <div class="chart-slide">
      <section class="history-histogram chart-slide__histogram">
        <h3 class="visually-hidden">Диаграмма</h3>
        <div class="history-histogram__chart" style="height: ${fullChartHeight + `px`}">
          <ul class="history-histogram__values">
            ${data.values.reduce((markup, value) => {
    markup += renderHistoryHistogramBar(value, maxValue, chartHeight);
    return markup;
  }, ``)}
          </ul>
        </div>
      </section>
      <section class="history-leaders chart-slide__leaders">
        <h3 class="visually-hidden">Лидеры</h3>
        <ul class="history-leaders__list">
          ${data.users.reduce((markup, user, i) => {
    if (i < 2) {
      markup += renderHistoryLeadersPerson(user);
    }
    return markup;
  }, ``)}
        </ul>
      </section>
    </div>
  `;
}

function renderDiagramDescription(data) {
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

class CanvasDiagramDrawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.theme = document.querySelector(`body`).classList.contains(`theme_light`) ? `light` : `dark`;
    this.shadowOffset = 1000; // px
  }

  drawBorderRadius(centerX, centerY, radiusControlPoint, angleControlPoint, radiusEndPoint, angleEndPoint) {
    const borderRadiusControlPoint = this.getCirclePoint(centerX, centerY, radiusControlPoint, angleControlPoint);
    const borderRadiusEndPoint = this.getCirclePoint(centerX, centerY, radiusEndPoint, angleEndPoint);

    this.ctx.quadraticCurveTo(borderRadiusControlPoint.x, borderRadiusControlPoint.y, borderRadiusEndPoint.x, borderRadiusEndPoint.y);
  }

  drawSector(sectorNumber, radius, center, ringWidth, startAngle, endAngle, borderRadiusSize, borderRadiusInRads, isAuxiliary) {
    const centerX = isAuxiliary ? center + this.shadowOffset : center; // For inset shadows drawing
    const centerY = center;
    const innerRadius = radius - ringWidth - 2 * borderRadiusSize;

    this.ctx.beginPath();
    // Outer radius
    this.ctx.arc(centerX, centerY, radius, startAngle + borderRadiusInRads, endAngle - borderRadiusInRads);
    // Outer first border radius
    this.drawBorderRadius(centerX, centerY, radius, endAngle, radius - borderRadiusSize, endAngle);
    // Ring line border
    this.moveAlongRadius(centerX, centerY, innerRadius + borderRadiusSize, endAngle);
    // Inner first border radius
    this.drawBorderRadius(centerX, centerY, innerRadius, endAngle, innerRadius, endAngle - borderRadiusInRads);
    // Inner radius
    this.ctx.arc(centerX, centerY, radius - ringWidth - 2 * borderRadiusSize, endAngle - borderRadiusInRads, startAngle + borderRadiusInRads, true);
    // Inner second border radius
    this.drawBorderRadius(centerX, centerY, innerRadius, startAngle, innerRadius + borderRadiusSize, startAngle);
    // Ring line border
    this.moveAlongRadius(centerX, centerY, radius - borderRadiusSize, startAngle);
    // Outer second border radius
    this.drawBorderRadius(centerX, centerY, radius, startAngle, radius, startAngle + borderRadiusInRads);

    if (!isAuxiliary) {
      this.ctx.fillStyle = this._createRadialGradient(sectorNumber, centerY, radius);
      this.ctx.fill();
      this._addShadows(...arguments);
    }
  }

  moveAlongRadius(centerX, centerY, radius, angle) {
    const endPoint = this.getCirclePoint(centerX, centerY, radius, angle);

    this.ctx.lineTo(endPoint.x, endPoint.y);
  }

  getCirclePoint(centerX, centerY, radiusPart, angle) {
    const point = { x: 0, y: 0 };

    if (angle >= 0 && angle < Math.PI / 2) {
      point.x = centerX + radiusPart * Math.sin(Math.PI / 2 - angle);
      point.y = centerY + radiusPart * Math.sin(angle);
    } else if (angle >= Math.PI / 2 && angle < Math.PI) {
      angle = angle - Math.PI / 2;
      point.x = centerX - radiusPart * Math.sin(angle);
      point.y = centerY + radiusPart * Math.sin(Math.PI / 2 - angle);
    } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      angle = angle - Math.PI;
      point.x = centerX - radiusPart * Math.sin(Math.PI / 2 - angle);
      point.y = centerY - radiusPart * Math.sin(angle);
    } else {
      angle = angle - 3 * Math.PI / 2;
      point.x = centerX + radiusPart * Math.sin(angle);
      point.y = centerY - radiusPart * Math.sin(Math.PI / 2 - angle);
    }

    return point;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Config of sectors gradients
   */
  _createRadialGradient(sectorNumber, center, mainRadius) {
    let firstCircleRadiusRatio;
    let secondCircleRadiusRatio;
    let firstColorStop;
    let secondColorStop;

    switch (sectorNumber) {
      case 1:
        if (this.theme === `dark`) {
          firstCircleRadiusRatio = 0.7188;
          firstColorStop = `rgba(211, 136, 4, 1)`;
          secondColorStop = `rgba(80, 52, 4, 1)`;
        } else {
          firstCircleRadiusRatio = 0.8125;
          firstColorStop = `rgba(255, 215, 112, 1)`;
          secondColorStop = `rgba(255, 250, 222, 1)`;
        }
        break;
      case 2:
        if (this.theme === `dark`) {
          firstCircleRadiusRatio = 0.7292;
          firstColorStop = `rgba(62, 42, 7, 1)`;
          secondColorStop = `rgba(16, 12, 5, 1)`;
        } else {
          firstCircleRadiusRatio = 0.8125;
          firstColorStop = `rgba(255, 238, 194, 1)`;
          secondColorStop = `rgba(255, 253, 243, 1)`;
        }
        break;
      case 3:
        if (this.theme === `dark`) {
          firstCircleRadiusRatio = 0.7188;
          firstColorStop = `rgba(89, 88, 85, 1)`;
          secondColorStop = `rgba(37, 28, 5, 1)`;
        } else {
          firstCircleRadiusRatio = 0.8281;
          firstColorStop = `rgba(240, 240, 240, 1)`;
          secondCircleRadiusRatio = 0.9219;
          secondColorStop = `rgba(252, 252, 252, 1)`;
        }
        break;
      case 4:
        if (this.theme === `dark`) {
          firstCircleRadiusRatio = 0.7188;
          firstColorStop = `rgba(49, 47, 44, 1)`;
          secondColorStop = `rgba(35, 27, 4, 1)`;
        } else {
          firstCircleRadiusRatio = 0.8281;
          firstColorStop = `rgba(233, 233, 233, 1)`;
          secondCircleRadiusRatio = 0.9219;
          secondColorStop = `rgba(252, 252, 252, 1)`;
        }
        break;
    }

    const gradient = this.ctx.createRadialGradient(center, center, firstCircleRadiusRatio * mainRadius, center, center, mainRadius * (secondCircleRadiusRatio || 1));

    gradient.addColorStop(0, firstColorStop);
    gradient.addColorStop(1, secondColorStop);

    return gradient;
  }

  _addShadows() {
    const slideNumber = arguments[0];
    const shadowsConfig = this._getShadows(slideNumber);

    this.drawSector(...arguments, true);

    shadowsConfig.forEach(shadow => {
      this.ctx.shadowColor = shadow.color;
      this.ctx.shadowBlur = shadow.blur || 10;
      this.ctx.lineWidth = shadow.blur || 10;
      this.ctx.shadowOffsetX = shadow.shadowOffsetX ? -this.shadowOffset + shadow.shadowOffsetX : -this.shadowOffset;
      this.ctx.shadowOffsetY = shadow.shadowOffsetY || 0;

      if (shadow.inset) {
        this.ctx.globalCompositeOperation = `source-atop`;
      }

      if (shadow.spread) {
        const scaleFactor = 0.5;
        this.ctx.save();
        this.ctx.scale(scaleFactor, scaleFactor);
      }

      this.ctx.stroke();

      this.ctx.restore();
      this.ctx.globalCompositeOperation = `source-over`;
    });
  }

  _getShadows(slideNumber) {
    const shadows = [];
    const insetBorderShadow = {
      blur: 1,
      color: `rgba(255, 255, 255, 0.5)`,
      shadowOffsetX: -1,
      shadowOffsetY: 1,
      inset: true
    };

    switch (slideNumber) {
      case 1:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(248, 158, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(255, 162, 0, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(255, 176, 57, 0.9)`,
              inset: true
            }
          );
        }
        break;
      case 2:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(147, 93, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(202, 176, 57, 0.4)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(255, 176, 57, 0.4)`,
              inset: true
            }
          );
        }
        break;
      case 3:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(0, 0, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(139, 139, 139, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(105, 105, 105, 0.2)`,
              inset: true
            }
          );
        }
        break;
      case 4:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(96, 96, 96, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(38, 38, 38, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            {
              color: `rgba(131, 131, 131, 0.6)`,
              inset: true
            },
            insetBorderShadow
          );
        }
        break;
    }

    return shadows;
  }
}

function drawCanvasDiagram({ categories, totalText }) {
  const OFFSET_ANGLE = 1; // degree
  const PIE_BORDER_RADIUS = 6; // px
  const CENTER_CIRCLE_RATIO = 0.7;
  const diagramCanvas = document.querySelector(`#doughnutDiagram`);
  const diagramSize = diagramCanvas.clientWidth - 40;
  const diagramRadius = diagramSize / 2;
  const totalValue = parseInt(totalText);
  const perimeterInPixels = 2 * Math.PI * diagramRadius;
  const borderRadiusInDegrees = PIE_BORDER_RADIUS / perimeterInPixels * 360;

  const drawer = new CanvasDiagramDrawer(diagramCanvas);
  let angleSum = 240; // initial angle for design purposes

  for (let i = 0; i < categories.length; i++) {
    const valueAngle = parseInt(categories[i].valueText) / totalValue * (360 - OFFSET_ANGLE * categories.length);
    drawer.drawSector(
      i + 1,
      diagramRadius,
      diagramCanvas.width / 2,
      diagramRadius * (1 - CENTER_CIRCLE_RATIO) - 2 * PIE_BORDER_RADIUS,
      drawer.degreesToRadians(angleSum),
      drawer.degreesToRadians(valueAngle + angleSum),
      PIE_BORDER_RADIUS,
      drawer.degreesToRadians(borderRadiusInDegrees)
    );

    angleSum += valueAngle + OFFSET_ANGLE;
  }
}

/**
 * @typedef Category
 * @type {Object}
 * @property {string} title - title of the category.
 * @property {string} valueText - string with some value consisting of the number and optionally of the string.
 * @property {string} differenceText - difference between current and previous periods for this category.
 */

/**
 * Render diagram slide content.
 *
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup for slide.
 */
function renderDiagramSlide(data) {
  return `
    <figure class="diagram">
      <h3 class="visually-hidden">Кольцевая диаграмма</h3>
      <div class="diagram__wrap">
        <div class="diagram__main-description">
          <p class="diagram__total headline">${data.totalText}</p>
          <p class="diagram__difference subhead subhead_dim">${data.differenceText}</p>
        </div>
        <div class="diagram__doughnut-wrap">
          <canvas id="doughnutDiagram" class="diagram__canvas" width="400" height="400"></canvas>
        </div>
      </div>
      ${renderDiagramDescription(data)}
    </figure>
  `;
}

/**
 * @typedef {'leaders' | 'vote' | 'activity' | 'chart' | 'diagram'} SlideType
 */

/**
 * Render content of the slide of the required type.
 *
 * @param {SlideType} slideType - alias of slide to render.
 * @param {SlideData} data - slide data.
 *
 * @returns {string} - markup with slide content.
 */
function renderSlideContent(slideType, data) {
  switch (slideType) {
    case 'leaders':
      return renderLeadersSlide(data);
    case 'vote':
      return renderVoteSlide(data);
    case 'activity':
      return renderActivitySlide(data);
    case 'chart':
      return renderChartSlide(data);
    case 'diagram':
      return renderDiagramSlide(data);
  }
}

let previousWindowWidth = globalThis.innerWidth;
let previousWindowHeight = globalThis.innerHeight;
let savedSlideName;
let savedSlideData;

/**
 * @typedef SlideData
 * @type {Object|string}
 * @property {string} title - slide title.
 * @property {string} subtitle - slide subtitle (sprint number).
 * @property {string} emoji - emoji for design goals.
 * @property {number} [selectedUserId] - id of voted person.
 * @property {number} [offset] - index of the person to be displayed first.
 * @property {HistoryValue[]} [values] - history chart values.
 * @property {string} [totalText] - total value of diagram representation.
 * @property {string} [differenceText] - description of the difference between current and previous values.
 * @property {Category[]} [categories] - categories for diagram representation.
 * @property {Object} [data] - activity data ordered by day of the week with array with 24 values corresponding to the hours.
 * @property {Person[]} users - ordered list of teammates.
 */

/**
 * @typedef Person
 * @type {Object}
 * @property {number} id - person id.
 * @property {string} name - person full name.
 * @property {string} avatar - name of image file with person photo.
 * @property {string} valueText - string with some value consisting of the number and optionally of the string.
 */

/**
 * Main render function.
 *
 * @param {SlideType} alias - alias of slide to render.
 * @param {SlideData|string} data - slide data or JSON with data.
 *
 * @returns {string} - markup for page rendering or empty string if there is no such slide type or data was not provided.
 */
window.renderTemplate = function(alias, data) {
  if (!alias || !data) {
    return ``;
  }

  if (typeof data === `string`) {
    data = JSON.parse(data);
  }

  savedSlideName = alias;
  savedSlideData = data;

  return `
    <main class="slide slide_${alias}">
      ${renderCaption(data)}
      <div class="slide__content">
        ${renderSlideContent(alias, data)}
      </div>
    </main>
  `;
}

/**
 * Post render function for calculations and logic depending on the rendered content
 *
 * @param {SlideType} alias - alias of slide to render.
 * @param {SlideData|string} data - slide data or JSON with data.
 */
window.postRenderScript = function(alias, data) {
  if (!data) {
    return ``;
  }

  if (typeof data === `string`) {
    data = JSON.parse(data);
  }

  switch (alias) {
    case 'vote':
      adjustVoteSlideIndents();
      break;
    case 'diagram':
      drawCanvasDiagram(data);
      break;
    default:
      break;
  }
}

const RESIZE_DEBOUNCE_DELAY = 120; // ms
const debouncedWindowResizeHandler = debounce(windowResizeHandler, RESIZE_DEBOUNCE_DELAY);
setVhCssProperty();
globalThis.addEventListener(`resize`, debouncedWindowResizeHandler);

function renderPage() {
  document.querySelector(`#output`).innerHTML = globalThis.renderTemplate(savedSlideName, savedSlideData);
  globalThis.postRenderScript(savedSlideName, savedSlideData);
}

function windowResizeHandler() {
  if (previousWindowHeight !== globalThis.innerHeight) {
    if (document.querySelector(`.slide_activity`)) {
      renderPage();
    }

    setVhCssProperty();

    if (document.querySelector(`.slide_vote`)) {
      adjustVoteSlideIndents();
    }

    if (document.querySelector(`.slide_chart`)) {
      renderPage();
    }
  }

  if (isRerenderNecessary()) {
    renderPage();
  }

  previousWindowHeight = globalThis.innerHeight;
  previousWindowWidth = globalThis.innerWidth;
}

function isOrientationChange() {
  return (previousWindowWidth > previousWindowHeight && globalThis.innerWidth < globalThis.innerHeight) || (previousWindowWidth < previousWindowHeight && globalThis.innerWidth > globalThis.innerHeight);
}

function isRerenderThreshold(width) {
  return (previousWindowWidth < width && globalThis.innerWidth >= width) ||
    (previousWindowWidth >= width && globalThis.innerWidth < width);
}

function isRerenderNecessary() {
  return isOrientationChange() || isRerenderThreshold(LANDSCAPE_PHONE_MIN_WIDTH) ||
    isRerenderThreshold(LANDSCAPE_DEFAULT_WIDTH) || isRerenderThreshold(TABLET_MIN_WIDTH);
}

const data = [
  {
    "alias": "leaders",
    "data": {
      "title": "Больше всего коммитов",
      "subtitle": "Спринт № 213",
      "emoji": "👑",
      "users": [
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "32"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "27"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "22"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "20"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "19"}
      ]
    }
  },
  {
    "alias": "leaders",
    "data": {
      "title": "Самый большой коммит",
      "subtitle": "Спринт № 213",
      "emoji": "😮",
      "users": [
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "4001 строка"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "3845 строк"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "3640 строк"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "3453 строки"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "2852 строки"}
      ]
    }
  },
  {
    "alias": "vote",
    "data": {
      "title": "Самый 🔎 внимательный разработчик",
      "subtitle": "Спринт № 213",
      "emoji": "🔎",
      "selectedUserId": 4,
      "users": [
        {"id": 1, "name": "Евгений Дементьев", "avatar": "1.jpg", "valueText": "22 голоса"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "19 голосов"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "17 голосов"},
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "16 голосов"},
        {"id": 11, "name": "Юрий Фролов", "avatar": "11.jpg", "valueText": "11 голосов"},
        {"id": 2, "name": "Александр Шлейко", "avatar": "2.jpg", "valueText": "10 голосов"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "9 голосов"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "8 голосов"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "7 голосов"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "6 голосов"},
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "5 голосов"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "4 голоса"}
      ]
    }
  },
  {
    "alias": "leaders",
    "data": {
      "title": "Самый 🔎 внимательный разработчик",
      "subtitle": "Спринт № 213",
      "emoji": "🔎",
      "selectedUserId": 11,
      "users": [
        {"id": 1, "name": "Евгений Дементьев", "avatar": "1.jpg", "valueText": "22 голоса"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "19 голосов"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "17 голосов"},
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "16 голосов"},
        {"id": 11, "name": "Юрий Фролов", "avatar": "11.jpg", "valueText": "15 голосов"},
        {"id": 2, "name": "Александр Шлейко", "avatar": "2.jpg", "valueText": "14 голосов"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "12 голосов"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "9 голосов"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "8 голосов"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "6 голосов"},
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "5 голосов"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "4 голоса"}
      ]
    }
  },
  {
    "alias": "vote",
    "data": {
      "title": "Самый 👪 командный разработчик",
      "subtitle": "Спринт № 213",
      "emoji": "👪",
      "offset": 8,
      "users": [
        {"id": 2, "name": "Александр Шлейко", "avatar": "2.jpg", "valueText": "24 голоса"},
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "21 голос"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "19 голосов"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "18 голосов"},
        {"id": 1, "name": "Евгений Дементьев", "avatar": "1.jpg", "valueText": "16 голосов"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "14 голосов"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "13 голосов"},
        {"id": 11, "name": "Юрий Фролов", "avatar": "11.jpg", "valueText": "11 голосов"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "9 голосов"},
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "7 голосов"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "6 голосов"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "5 голосов"}
      ]
    }
  },
  {
    "alias": "leaders",
    "data": {
      "title": "Самый 👪 командный разработчик",
      "subtitle": "Спринт № 213",
      "emoji": "👪",
      "selectedUserId": 6,
      "users": [
        {"id": 2, "name": "Александр Шлейко", "avatar": "2.jpg", "valueText": "24 голоса"},
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "21 голос"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "19 голосов"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "18 голосов"},
        {"id": 1, "name": "Евгений Дементьев", "avatar": "1.jpg", "valueText": "16 голосов"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "14 голосов"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "13 голосов"},
        {"id": 11, "name": "Юрий Фролов", "avatar": "11.jpg", "valueText": "11 голосов"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "9 голосов"},
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "7 голосов"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "6 голосов"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "5 голосов"}
      ]
    }
  },
  {
    "alias": "chart",
    "data": {
      "title": "Коммиты",
      "subtitle": "Спринт № 213",
      "values": [
        {"title": "203", "value": 108},
        {"title": "204", "value": 160},
        {"title": "205", "value": 126},
        {"title": "206", "value": 134},
        {"title": "207", "value": 112},
        {"title": "208", "value": 152},
        {"title": "209", "value": 128},
        {"title": "210", "value": 164},
        {"title": "211", "value": 118},
        {"title": "212", "value": 140},
        {"title": "213", "value": 182, "active": true},
        {"title": "214", "value": 0},
        {"title": "215", "value": 0},
        {"title": "216", "value": 0},
        {"title": "217", "value": 0},
        {"title": "218", "value": 0}
      ],
      "users": [
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "32"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "27"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "22"}
      ]
    }
  },
  {
    "alias": "chart",
    "data": {
      "title": "Строки кода",
      "subtitle": "Спринт № 213",
      "values": [
        {"title": "203", "value": 47798},
        {"title": "204", "value": 68590},
        {"title": "205", "value": 55472},
        {"title": "206", "value": 63073},
        {"title": "207", "value": 51917},
        {"title": "208", "value": 65852},
        {"title": "209", "value": 60693},
        {"title": "210", "value": 70631},
        {"title": "211", "value": 57299},
        {"title": "212", "value": 62839},
        {"title": "213", "value": 74156, "active": true},
        {"title": "214", "value": 0},
        {"title": "215", "value": 0},
        {"title": "216", "value": 0},
        {"title": "217", "value": 0},
        {"title": "218", "value": 0}
      ],
      "users": [
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "8739"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "7538"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "6845"}
      ]
    }
  },
  {
    "alias": "diagram",
    "data": {
      "title": "Размер коммитов",
      "subtitle": "Спринт № 213",
      "totalText": "182 коммита",
      "differenceText": "+42 с прошлого спринта",
      "categories": [
        {"title": "> 1001 строки", "valueText": "30 коммитов", "differenceText": "+8 коммитов"},
        {"title": "501 — 1000 строк", "valueText": "32 коммита", "differenceText": "+6 коммитов"},
        {"title": "101 — 500 строк", "valueText": "58 коммитов", "differenceText": "+16 коммитов"},
        {"title": "1 — 100 строк", "valueText": "62 коммита", "differenceText": "+12 коммитов"}
      ]
    }
  },
  {
    "alias": "activity",
    "data": {
      "title": "Коммиты, 1 неделя",
      "subtitle": "Спринт № 213",
      "data": {
        "mon": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 3, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        "tue": [0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 1, 0, 3, 0, 0, 2, 1, 0],
        "wed": [1, 0, 0, 0, 1, 0, 5, 0, 0, 4, 0, 0, 0, 5, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
        "thu": [0, 1, 0, 1, 0, 0, 0, 0, 6, 0, 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0],
        "fri": [0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 5, 0, 4, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0],
        "sat": [0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        "sun": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
      }
    }
  },
  {
    "alias": "activity",
    "data": {
      "title": "Коммиты, 2 неделя",
      "subtitle": "Спринт № 213",
      "data": {
        "mon": [0, 1, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 2],
        "tue": [0, 1, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "wed": [0, 0, 0, 0, 2, 0, 1, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 0, 0],
        "thu": [0, 0, 2, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 3, 0, 1, 1, 0, 0, 0],
        "fri": [0, 0, 0, 1, 1, 0, 2, 0, 4, 0, 0, 0, 2, 0, 3, 2, 0, 0, 0, 0, 1, 1, 0, 1],
        "sat": [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 2, 2, 0, 2, 0, 0],
        "sun": [0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1]
      }
    }
  }
];
const searchParams = new URLSearchParams(document.location.search);
const slideIndex = searchParams.get('slide') || 0;
const theme = searchParams.get('theme') || 'dark';
let svgSprite = document.querySelector('#svg-sprite');

if (!svgSprite) {
  svgSprite = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
  svgSprite.classList.add(`visually-hidden`);
  document.body.insertAdjacentElement(`afterbegin`, svgSprite);
}

document.body.classList.add(`theme_${theme}`);

if (theme === 'dark') {
  svgSprite.innerHTML = `
            <defs>
                <symbol id="button" viewbox="0 0 64 64">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M32 62C48.5685 62 62 48.5685 62 32C62 15.4315 48.5685 2 32 2C15.4315 2 2 15.4315 2 32C2 48.5685 15.4315 62 32 62ZM32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64ZM59 32C59 46.9117 46.9117 59 32 59C17.0883 59 5 46.9117 5 32C5 17.0883 17.0883 5 32 5C46.9117 5 59 17.0883 59 32ZM25.0607 27.9393C24.4749 27.3536 23.5251 27.3536 22.9393 27.9393C22.3536 28.5251 22.3536 29.4749 22.9393 30.0607L30.9393 38.0607C31.5251 38.6464 32.4749 38.6464 33.0607 38.0607L41.0607 30.0607C41.6464 29.4749 41.6464 28.5251 41.0607 27.9393C40.4749 27.3536 39.5251 27.3536 38.9393 27.9393L32 34.8787L25.0607 27.9393Z"></path>
                </symbol>
                <symbol id="bar-s" viewbox="0 0 34 34">
                    <mask id="mask0-s" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="1" width="34" height="32">
                        <path d="M0 14.9767C0 13.7308 0.580524 12.5561 1.5702 11.7993L14.5702 1.85808C16.0044 0.761324 17.9956 0.761325 19.4298 1.85808L32.4298 11.7993C33.4195 12.5561 34 13.7308 34 14.9767V19.0233C34 20.2692 33.4195 21.4439 32.4298 22.2007L19.4298 32.1419C17.9956 33.2387 16.0044 33.2387 14.5702 32.1419L1.5702 22.2007C0.580524 21.4439 0 20.2692 0 19.0233V14.9767Z" fill="#151311"></path>
                    </mask>
                    <g mask="url(#mask0-s)">
                        <g filter="url(#filter0_ii-s)">
                            <path d="M0 13.9883C0 13.3654 0.290262 12.778 0.7851 12.3996L15.7851 0.929041C16.5022 0.380661 17.4978 0.380662 18.2149 0.929041L33.2149 12.3996C33.7097 12.778 34 13.3654 34 13.9883V20.0117C34 20.6346 33.7097 21.222 33.2149 21.6004L18.2149 33.071C17.4978 33.6193 16.5022 33.6193 15.7851 33.071L0.785101 21.6004C0.290263 21.222 0 20.6346 0 20.0117V13.9883Z" fill="url(#paint0_radial-s)" fill-opacity="0.65"></path>
                        </g>
                        <g filter="url(#filter1_iif-s)">
                            <path d="M34 20.0117V13L17 26V34L33.2149 21.6004C33.7097 21.222 34 20.6346 34 20.0117Z" fill="url(#paint1_radial-s)" fill-opacity="0.8"></path>
                        </g>
                        <g filter="url(#filter2_if-s)">
                            <path d="M17 0L0 13L14.5702 24.1419C16.0044 25.2387 17.9956 25.2387 19.4298 24.1419L34 13L17 0Z" fill="url(#paint2_radial-s)" fill-opacity="0.7"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-s" x="-1" y="0.517754" width="36" height="33.9645" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="1" dy="1"></feoffset>
                            <fegaussianblur stddeviation="8"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.440542 0 0 0 0 0.400529 0 0 0 0 0.367792 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1"></feoffset>
                            <fegaussianblur stddeviation="1"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_iif-s" x="15" y="11" width="21" height="25" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="8"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.440542 0 0 0 0 0.400529 0 0 0 0 0.367792 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1" dy="1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_if-s" x="-2" y="-1" width="37" height="26.9645" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2"></feoffset>
                            <fegaussianblur stddeviation="1"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.9272 0 0 0 0 0.91928 0 0 0 0 0.9128 0 0 0 0.15 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.5" result="effect2_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(30.2818 26.6165) rotate(-156.928) scale(77.2877 1713.92)">
                            <stop stop-color="#131110"></stop>
                            <stop offset="1"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(23.0802 22.3714) rotate(-101.873) scale(99.4275 2181.5)">
                            <stop offset="0.0001" stop-color="#3A3530"></stop>
                            <stop offset="1" stop-color="#49423D"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(30.4998 18.9502) rotate(-163.167) scale(41.2679 899.814)">
                            <stop stop-color="#3E3934"></stop>
                            <stop offset="1" stop-color="#221F1C"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-m" viewbox="0 0 34 41">
                    <mask id="mask0-m" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="34" height="40">
                        <path opacity="0.95" d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V26.0233C34 27.2692 33.4195 28.4439 32.4298 29.2007L19.4298 39.1419C17.9956 40.2387 16.0044 40.2387 14.5702 39.1419L1.5702 29.2007C0.580524 28.4439 0 27.2692 0 26.0233V13.9767Z" fill="url(#paint0_radial-m)" fill-opacity="0.95"></path>
                    </mask>
                    <g mask="url(#mask0-m)">
                        <g filter="url(#filter0_ii-m)">
                            <path d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V26.0233C34 27.2692 33.4195 28.4439 32.4298 29.2007L19.4298 39.1419C17.9956 40.2387 16.0044 40.2387 14.5702 39.1419L1.5702 29.2007C0.580524 28.4439 0 27.2692 0 26.0233V13.9767Z" fill="url(#paint1_radial-m)" fill-opacity="0.9"></path>
                        </g>
                        <g filter="url(#filter1_iif-m)">
                            <path d="M34 27.0117V12.9883C34 12.3654 33.7097 11.778 33.2149 11.3996L17 -1V41L33.2149 28.6004C33.7097 28.222 34 27.6346 34 27.0117Z" fill="url(#paint2_radial-m)" fill-opacity="0.9"></path>
                        </g>
                        <g filter="url(#filter2_iif-m)">
                            <path d="M17 -1L0 12L14.5702 23.1419C16.0044 24.2387 17.9956 24.2387 19.4298 23.1419L34 12L17 -1Z" fill="url(#paint3_radial-m)" fill-opacity="0.9"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-m" x="-1" y="0.0355148" width="37" height="41.929" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.362929 0 0 0 0 0.455371 0 0 0 0 0.554189 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_iif-m" x="15" y="-3" width="21" height="46" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="8"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.362929 0 0 0 0 0.455371 0 0 0 0 0.554189 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1" dy="1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-m" x="-2" y="-2" width="38" height="27.9645" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="8"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.362929 0 0 0 0 0.455371 0 0 0 0 0.554189 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2"></feoffset>
                            <fegaussianblur stddeviation="1"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.5" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(25.3048 24.3353) rotate(-113.885) scale(82.2113 2670.94)">
                            <stop offset="0.0001" stop-color="#231600"></stop>
                            <stop offset="1" stop-color="#705C5E"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(25.3048 24.3353) rotate(-113.885) scale(82.2113 2670.94)">
                            <stop offset="0.0001" stop-color="#231600"></stop>
                            <stop offset="1" stop-color="#705C5E"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(37.2501 16.8307) rotate(-115.254) scale(83.8533 1990.08)">
                            <stop offset="0.0001" stop-color="#231600"></stop>
                            <stop offset="1" stop-color="#705C5E"></stop>
                        </radialgradient>
                        <radialgradient id="paint3_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(30.4998 17.9502) rotate(-157.423) scale(77.4885 1689.58)">
                            <stop offset="0.0001" stop-color="#231600"></stop>
                            <stop offset="1" stop-color="#705C5E"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-l" viewbox="0 0 34 57">
                    <mask id="mask0-l" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="34" height="56">
                        <path d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V42.0233C34 43.2692 33.4195 44.4439 32.4298 45.2007L19.4298 55.1419C17.9956 56.2387 16.0044 56.2387 14.5702 55.1419L1.5702 45.2007C0.580524 44.4439 0 43.2692 0 42.0233V13.9767Z" fill="url(#paint0_radial-l)" fill-opacity="0.95"></path>
                    </mask>
                    <g mask="url(#mask0-l)">
                        <g filter="url(#filter0_ii-l)">
                            <path d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V42.0233C34 43.2692 33.4195 44.4439 32.4298 45.2007L19.4298 55.1419C17.9956 56.2387 16.0044 56.2387 14.5702 55.1419L1.5702 45.2007C0.580524 44.4439 0 43.2692 0 42.0233V13.9767Z" fill="url(#paint1_radial-l)" fill-opacity="0.9"></path>
                        </g>
                        <g filter="url(#filter1_dif-l)">
                            <path d="M34 43.0117V12.9883C34 12.3654 33.7097 11.778 33.2149 11.3996L17 -1V57L33.2149 44.6004C33.7097 44.222 34 43.6346 34 43.0117Z" fill="url(#paint2_radial-l)"></path>
                        </g>
                        <g filter="url(#filter2_iif-l)">
                            <path d="M17 -1L0 12L14.5702 23.1419C16.0044 24.2387 17.9956 24.2387 19.4298 23.1419L34 12L17 -1Z" fill="url(#paint3_radial-l)" fill-opacity="0.8"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-l" x="-1" y="0.0355148" width="37" height="57.929" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.623 0 0 0 0 0.05 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1" dy="1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_dif-l" x="12" y="-6" width="27" height="71" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></fecolormatrix>
                            <feoffset dy="4"></feoffset>
                            <fegaussianblur stddeviation="2"></fegaussianblur>
                            <fecolormatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></fecolormatrix>
                            <feblend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feblend>
                            <feblend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2" dy="-1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="2.5" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-l" x="-1" y="-2" width="37" height="27.9645" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="8"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.623 0 0 0 0 0.05 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.922292 0 0 0 0 0.60255 0 0 0 0 0.0485417 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.5" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(25.3053 42.989) rotate(-109.233) scale(70.4297 2348.99)">
                            <stop offset="0.0001" stop-color="#211602"></stop>
                            <stop offset="1" stop-color="#AC7109"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(25.3053 42.989) rotate(-109.233) scale(70.4297 2348.99)">
                            <stop offset="0.0001" stop-color="#211602"></stop>
                            <stop offset="1" stop-color="#AC7109"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(31.9667 47.8734) rotate(-106.704) scale(52.0707 812.895)">
                            <stop offset="0.0625" stop-color="#201502"></stop>
                            <stop offset="1" stop-color="#C7830A"></stop>
                        </radialgradient>
                        <radialgradient id="paint3_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(30.4998 17.9502) rotate(-157.423) scale(77.4885 1689.58)">
                            <stop offset="0.0001" stop-color="#211602"></stop>
                            <stop offset="1" stop-color="#AC7109"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-xl" viewbox="0 0 34 73">
                    <mask id="mask0-xl" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="34" height="72">
                        <path d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V58.0233C34 59.2692 33.4195 60.4439 32.4298 61.2007L19.4298 71.1419C17.9956 72.2387 16.0044 72.2387 14.5702 71.1419L1.5702 61.2007C0.580524 60.4439 0 59.2692 0 58.0233V13.9767Z" fill="url(#paint0_radial-xl)" fill-opacity="0.95"></path>
                    </mask>
                    <g mask="url(#mask0-xl)">
                        <g filter="url(#filter0_ii-xl)">
                            <path d="M0 13.9767C0 12.7308 0.580524 11.5561 1.5702 10.7993L14.5702 0.858083C16.0044 -0.238676 17.9956 -0.238675 19.4298 0.858083L32.4298 10.7993C33.4195 11.5561 34 12.7308 34 13.9767V58.0233C34 59.2692 33.4195 60.4439 32.4298 61.2007L19.4298 71.1419C17.9956 72.2387 16.0044 72.2387 14.5702 71.1419L1.5702 61.2007C0.580524 60.4439 0 59.2692 0 58.0233V13.9767Z" fill="url(#paint1_radial-xl)"></path>
                        </g>
                        <g filter="url(#filter1_dif-xl)">
                            <path d="M34 59.0117V12.9883C34 12.3654 33.7097 11.778 33.2149 11.3996L17 -1V73L33.2149 60.6004C33.7097 60.222 34 59.6346 34 59.0117Z" fill="url(#paint2_radial-xl)"></path>
                        </g>
                        <g filter="url(#filter2_iif-xl)">
                            <path d="M17 -1L0 12L14.5702 23.1419C16.0044 24.2387 17.9956 24.2387 19.4298 23.1419L34 12L17 -1Z" fill="url(#paint3_radial-xl)" fill-opacity="0.8"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-xl" x="-1" y="0.0355072" width="37" height="73.929" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.623 0 0 0 0 0.05 0 0 0 0.9 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1" dy="1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_dif-xl" x="13" y="-5" width="25" height="86" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></fecolormatrix>
                            <feoffset dy="4"></feoffset>
                            <fegaussianblur stddeviation="2"></fegaussianblur>
                            <fecolormatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></fecolormatrix>
                            <feblend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feblend>
                            <feblend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1" dy="-1"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.623 0 0 0 0 0.05 0 0 0 0.9 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="2" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-xl" x="-1" y="-2" width="37" height="27.9645" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2" dy="2"></feoffset>
                            <fegaussianblur stddeviation="15.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.623 0 0 0 0 0.05 0 0 0 0.9 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2"></feoffset>
                            <fegaussianblur stddeviation="0.5"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.5" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(28.3313 64.8204) rotate(-102.092) scale(67.4131 846.864)">
                            <stop stop-color="#201502"></stop>
                            <stop offset="1" stop-color="#C7830A"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(28.3313 64.8204) rotate(-102.092) scale(67.4131 846.864)">
                            <stop stop-color="#201502"></stop>
                            <stop offset="1" stop-color="#C7830A"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(31.9667 61.3557) rotate(-100.534) scale(54.7003 683.353)">
                            <stop stop-color="#201502"></stop>
                            <stop offset="1" stop-color="#C7830A"></stop>
                        </radialgradient>
                        <radialgradient id="paint3_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(19.1537 23.663) rotate(-102.078) scale(61.741 1819.91)">
                            <stop stop-color="#201502"></stop>
                            <stop offset="1" stop-color="#C7830A"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
            </defs>
        `;
} else {
  svgSprite.innerHTML = `
            <defs>
                <symbol id="button" viewbox="0 0 64 64">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M32 62C48.5685 62 62 48.5685 62 32C62 15.4315 48.5685 2 32 2C15.4315 2 2 15.4315 2 32C2 48.5685 15.4315 62 32 62ZM32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64ZM59 32C59 46.9117 46.9117 59 32 59C17.0883 59 5 46.9117 5 32C5 17.0883 17.0883 5 32 5C46.9117 5 59 17.0883 59 32ZM25.0607 27.9393C24.4749 27.3536 23.5251 27.3536 22.9393 27.9393C22.3536 28.5251 22.3536 29.4749 22.9393 30.0607L30.9393 38.0607C31.5251 38.6464 32.4749 38.6464 33.0607 38.0607L41.0607 30.0607C41.6464 29.4749 41.6464 28.5251 41.0607 27.9393C40.4749 27.3536 39.5251 27.3536 38.9393 27.9393L32 34.8787L25.0607 27.9393Z"></path>
                </symbol>
                <symbol id="bar-s" viewbox="0 0 45 45">
                    <mask id="mask0-s" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="1" width="45" height="42">
                        <path opacity="0.92" d="M0.866699 19.8603C0.866699 18.2578 1.61341 16.7467 2.88641 15.7733L19.608 2.9862C21.4528 1.57546 24.014 1.57546 25.8588 2.9862L42.5803 15.7733C43.8533 16.7467 44.6 18.2578 44.6 19.8603V25.0654C44.6 26.6679 43.8533 28.179 42.5803 29.1524L25.8588 41.9395C24.014 43.3503 21.4528 43.3503 19.608 41.9395L2.88641 29.1524C1.61341 28.179 0.866699 26.6679 0.866699 25.0654V19.8603Z" fill="#2b1f00"></path>
                    </mask>
                    <g mask="url(#mask0-s)">
                        <g filter="url(#filter0_ii-s)">
                            <path d="M0.866699 18.589C0.866699 17.7878 1.24006 17.0323 1.87655 16.5455L21.1707 1.79119C22.0931 1.08583 23.3737 1.08583 24.2961 1.79119L43.5902 16.5455C44.2267 17.0323 44.6 17.7878 44.6 18.589V26.3367C44.6 27.1379 44.2267 27.8935 43.5902 28.3802L24.2961 43.1345C23.3737 43.8399 22.0931 43.8399 21.1707 43.1345L1.87655 28.3802C1.24006 27.8935 0.866699 27.1379 0.866699 26.3367V18.589Z" fill="url(#paint0_radial-s)" fill-opacity="0.8"></path>
                        </g>
                        <g filter="url(#filter1_if-s)">
                            <path d="M44.6 26.3367V22.5235C44.6 20.3925 42.1575 19.1855 40.4648 20.48L23.7432 33.2671C23.1067 33.7538 22.7333 34.5093 22.7333 35.3106V44.3295L43.5902 28.3802C44.2266 27.8935 44.6 27.1379 44.6 26.3367Z" fill="url(#paint1_radial-s)" fill-opacity="0.8"></path>
                        </g>
                        <g filter="url(#filter2_iif-s)">
                            <path d="M22.7334 0.596191L0.866699 17.3178L19.608 31.6493C21.4528 33.0601 24.014 33.0601 25.8588 31.6493L44.6 17.3178L22.7334 0.596191Z" fill="url(#paint2_radial-s)" fill-opacity="0.9"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-s" x="-0.419575" y="1.26215" width="46.3059" height="43.6877" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="10.2902"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.414167 0 0 0 0 0.414167 0 0 0 0 0.414167 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627"></feoffset>
                            <fegaussianblur stddeviation="1.28627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_if-s" x="20.1608" y="17.3737" width="27.0118" height="29.5284" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1.28627" result="effect2_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-s" x="-0.419575" y="-0.690083" width="47.5922" height="35.97" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="12.8627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.643333 0 0 0 0 0.643333 0 0 0 0 0.643333 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2.57255"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0 0.98 0 0 0 0.8 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.643137" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(39.8174 34.8323) rotate(-161.19) scale(66.2871 1469.97)">
                            <stop stop-color="#fafafa"></stop>
                            <stop offset="1" stop-color="#fafafa"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(41.3843 28.2511) rotate(-173.454) scale(39.4888 63.5928)">
                            <stop stop-color="#eaeaea"></stop>
                            <stop offset="0.0001" stop-color="#e9e9e9"></stop>
                            <stop offset="1" stop-color="#e4e4e4"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-s" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(46.5294 19.8903) rotate(-165.964) scale(42.4276 24.7298)">
                            <stop stop-color="#fafafa"></stop>
                            <stop offset="1" stop-color="#F8F8F8"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-m" viewbox="0 0 45 54">
                    <mask id="mask0-m" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="45" height="53">
                        <path opacity="0.92" d="M0.733398 18.8484C0.733398 17.2459 1.48011 15.7348 2.75311 14.7614L19.4747 1.97429C21.3195 0.563563 23.8807 0.563562 25.7255 1.97429L42.447 14.7614C43.72 15.7348 44.4667 17.2459 44.4667 18.8484V34.3437C44.4667 35.9462 43.72 37.4573 42.447 38.4307L25.7255 51.2178C23.8807 52.6285 21.3195 52.6285 19.4747 51.2178L2.75311 38.4307C1.48011 37.4573 0.733398 35.9462 0.733398 34.3437V18.8484Z" fill="#171100"></path>
                    </mask>
                    <g mask="url(#mask0-m)">
                        <g filter="url(#filter0_ii-m)">
                            <path d="M0.733398 18.8484C0.733398 17.2459 1.48011 15.7348 2.75311 14.7614L19.4747 1.97429C21.3195 0.563563 23.8807 0.563562 25.7255 1.97429L42.447 14.7614C43.72 15.7348 44.4667 17.2459 44.4667 18.8484V34.3437C44.4667 35.9462 43.72 37.4573 42.447 38.4307L25.7255 51.2178C23.8807 52.6285 21.3195 52.6285 19.4747 51.2178L2.75311 38.4307C1.48011 37.4573 0.733398 35.9462 0.733398 34.3437V18.8484Z" fill="url(#paint0_radial-m)" fill-opacity="0.9"></path>
                        </g>
                        <g filter="url(#filter1_iif-m)">
                            <path d="M44.4667 35.615V17.5771C44.4667 16.7759 44.0933 16.0203 43.4568 15.5336L22.6 -0.41571V53.6078L43.4569 37.6585C44.0933 37.1718 44.4667 36.4162 44.4667 35.615Z" fill="url(#paint1_radial-m)" fill-opacity="0.9"></path>
                        </g>
                        <g filter="url(#filter2_iif-m)">
                            <path d="M19.4747 1.97429L0.733398 16.3059L19.4747 30.6374C21.3195 32.0482 23.8807 32.0482 25.7255 30.6374L44.4667 16.3059L25.7255 1.97429C23.8807 0.563562 21.3195 0.563563 19.4747 1.97429Z" fill="url(#paint2_radial-m)" fill-opacity="0.9"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-m" x="-0.552876" y="0.91626" width="47.5922" height="53.9322" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="6.43137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.815479 0 0 0 0 0.82293 0 0 0 0 0.904885 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_iif-m" x="20.0275" y="-2.98826" width="27.0118" height="59.1686" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="10.2902"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.783083 0 0 0 0 0.767481 0 0 0 0 0.76025 0 0 0 0.3 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0 0.97 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1.28627" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-m" x="-0.552876" y="-0.370015" width="47.5922" height="34.638" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="3.85882"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.858292 0 0 0 0 0.848099 0 0 0 0 0.843375 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2.57255"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 0.99 0 0 0 0 0.99 0 0 0 0 0.99 0 0 0 0.8 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.643137" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(33.2823 32.1724) rotate(-113.885) scale(105.746 3435.56)">
                            <stop stop-color="#eae8e8"></stop>
                            <stop offset="1" stop-color="#eeedec"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(48.9687 63.2551) rotate(-136.273) scale(81.8783 1943.2)">
                            <stop stop-color="#e8e6e6"></stop>
                            <stop offset="1" stop-color="#d6d3d1"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-m" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(39.9645 23.9595) rotate(-156.43) scale(56.1337 1223.95)">
                            <stop stop-color="#f7f7f7"></stop>
                            <stop offset="1" stop-color="#EAE8E8"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-l" viewbox="0 0 45 74">
                    <mask id="mask0-l" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="45" height="73">
                        <path opacity="0.92" d="M0.733398 18.3818C0.733398 16.7793 1.48011 15.2682 2.75311 14.2948L19.4747 1.50768C21.3195 0.0969491 23.8807 0.0969484 25.7255 1.50768L42.447 14.2948C43.72 15.2682 44.4667 16.7793 44.4667 18.3818V54.4575C44.4667 56.06 43.72 57.5711 42.447 58.5445L25.7255 71.3316C23.8807 72.7423 21.3195 72.7423 19.4747 71.3316L2.75311 58.5445C1.48011 57.5711 0.733398 56.06 0.733398 54.4575V18.3818Z" fill="#ff8080"></path>
                    </mask>
                    <g mask="url(#mask0-l)">
                        <g filter="url(#filter0_ii-l)">
                            <path d="M0.733398 18.3818C0.733398 16.7793 1.48011 15.2682 2.75311 14.2948L19.4747 1.50768C21.3195 0.0969491 23.8807 0.0969484 25.7255 1.50768L42.447 14.2948C43.72 15.2682 44.4667 16.7793 44.4667 18.3818V54.4575C44.4667 56.06 43.72 57.5711 42.447 58.5445L25.7255 71.3316C23.8807 72.7423 21.3195 72.7423 19.4747 71.3316L2.75311 58.5445C1.48011 57.5711 0.733398 56.06 0.733398 54.4575V18.3818Z" fill="url(#paint0_radial-l)"></path>
                        </g>
                        <g filter="url(#filter1_iif-l)">
                            <path d="M44.4667 54.4575V18.3818C44.4667 16.7793 43.72 15.2682 42.447 14.2948L30.8705 5.44217C27.485 2.85323 22.6 5.26724 22.6 9.52922V73.7216L42.447 58.5445C43.72 57.5711 44.4667 56.06 44.4667 54.4575Z" fill="url(#paint1_radial-l)" fill-opacity="0.8"></path>
                        </g>
                        <g filter="url(#filter2_iif-l)">
                            <path d="M19.4747 1.50768L0.733398 15.8392L19.4747 30.1708C21.3195 31.5815 23.8807 31.5815 25.7255 30.1708L44.4667 15.8392L25.7255 1.50768C23.8807 0.096948 21.3195 0.096949 19.4747 1.50768Z" fill="url(#paint2_radial-l)" fill-opacity="0.8"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-l" x="-0.552876" y="0.449646" width="45.0196" height="73.2263" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset></feoffset>
                            <fegaussianblur stddeviation="12.8627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.4 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_iif-l" x="20.0275" y="1.80215" width="27.0118" height="74.492" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset></feoffset>
                            <fegaussianblur stddeviation="12.8627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.4 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1.28627" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-l" x="-0.552876" y="-0.836629" width="47.5922" height="34.638" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="10.2902"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.72 0 0 0 0 3.33786e-08 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2.57255"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.643137" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(2.66281 22.9138) rotate(68.6417) scale(54.5546 31.9803)">
                            <stop stop-color="#fffffe"></stop>
                            <stop offset="1" stop-color="#fff6e4"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(32.8902 8.1216) rotate(90) scale(90.6824 26.5793)">
                            <stop stop-color="#ffeab4"></stop>
                            <stop offset="1" stop-color="#ffe7b4"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-l" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(39.9645 23.4928) rotate(-168.354) scale(53.8454 1174.06)">
                            <stop offset="0.0364583" stop-color="#fffaed"></stop>
                            <stop offset="1" stop-color="#FFEDC9"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
                <symbol id="bar-xl" viewbox="0 0 44 95">
                    <mask id="mask0-xl" mask-type="alpha" maskunits="userSpaceOnUse" x="0" y="0" width="44" height="93">
                        <path opacity="0.92" d="M0.199951 18.3583C0.199951 16.7558 0.946665 15.2447 2.21966 14.2713L18.9412 1.48418C20.786 0.0734504 23.3472 0.0734494 25.192 1.48418L41.9136 14.2713C43.1866 15.2447 43.9333 16.7558 43.9333 18.3583V75.0144C43.9333 76.6169 43.1866 78.1279 41.9136 79.1014L25.192 91.8885C23.3472 93.2992 20.786 93.2992 18.9412 91.8885L2.21966 79.1014C0.946666 78.1279 0.199951 76.6169 0.199951 75.0144V18.3583Z" fill="#261c00"></path>
                    </mask>
                    <g mask="url(#mask0-xl)">
                        <g filter="url(#filter0_ii-xl)">
                            <path d="M0.199951 18.3583C0.199951 16.7558 0.946665 15.2447 2.21966 14.2713L18.9412 1.48418C20.786 0.0734504 23.3472 0.0734494 25.192 1.48418L41.9136 14.2713C43.1866 15.2447 43.9333 16.7558 43.9333 18.3583V75.0144C43.9333 76.6169 43.1866 78.1279 41.9136 79.1014L25.192 91.8885C23.3472 93.2992 20.786 93.2992 18.9412 91.8885L2.21966 79.1014C0.946666 78.1279 0.199951 76.6169 0.199951 75.0144V18.3583Z" fill="url(#paint0_radial-xl)"></path>
                        </g>
                        <g filter="url(#filter1_iif-xl)">
                            <path d="M43.9333 76.2856V17.087C43.9333 16.2858 43.5599 15.5302 42.9234 15.0435L22.0666 -0.905823V94.2785L42.9234 78.3292C43.5599 77.8424 43.9333 77.0869 43.9333 76.2856Z" fill="url(#paint1_radial-xl)" fill-opacity="0.4"></path>
                        </g>
                        <g filter="url(#filter2_iif-xl)">
                            <path d="M18.9412 1.48418L0.199951 15.8157L18.9412 30.1473C20.786 31.558 23.3472 31.558 25.192 30.1473L43.9333 15.8157L25.192 1.48418C23.3472 0.0734494 20.786 0.0734504 18.9412 1.48418Z" fill="url(#paint2_radial-xl)" fill-opacity="0.8"></path>
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_ii-xl" x="-1.08632" y="0.426147" width="45.0196" height="93.8067" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset></feoffset>
                            <fegaussianblur stddeviation="12.8627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.4 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                        </filter>
                        <filter id="filter1_iif-xl" x="19.494" y="-3.47837" width="27.0118" height="100.329" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset></feoffset>
                            <fegaussianblur stddeviation="12.8627"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.69 0 0 0 0 0.225 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-1.28627" dy="1.28627"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="1.28627" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <filter id="filter2_iif-xl" x="-1.08632" y="-0.860127" width="47.5922" height="34.638" filterunits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feflood flood-opacity="0" result="BackgroundImageFix"></feflood>
                            <feblend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="2.57255" dy="2.57255"></feoffset>
                            <fegaussianblur stddeviation="10.2902"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.72 0 0 0 0 0 0 0 0 0.2 0"></fecolormatrix>
                            <feblend mode="normal" in2="shape" result="effect1_innerShadow"></feblend>
                            <fecolormatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></fecolormatrix>
                            <feoffset dx="-2.57255"></feoffset>
                            <fegaussianblur stddeviation="0.643137"></fegaussianblur>
                            <fecomposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></fecomposite>
                            <fecolormatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"></fecolormatrix>
                            <feblend mode="normal" in2="effect1_innerShadow" result="effect2_innerShadow"></feblend>
                            <fegaussianblur stddeviation="0.643137" result="effect3_foregroundBlur"></fegaussianblur>
                        </filter>
                        <radialgradient id="paint0_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(-6.87456 11.9569) rotate(67.5294) scale(132.932 35.7564)">
                            <stop stop-color="#ffdd9c"></stop>
                            <stop offset="1" stop-color="#ffd363"></stop>
                        </radialgradient>
                        <radialgradient id="paint1_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(32.3568 27.3922) rotate(90) scale(60.4549 13.8888)">
                            <stop stop-color="#ffb800"></stop>
                            <stop offset="1" stop-color="#ffef99" stop-opacity="0.87"></stop>
                        </radialgradient>
                        <radialgradient id="paint2_radial-xl" cx="0" cy="0" r="1" gradientunits="userSpaceOnUse" gradienttransform="translate(39.431 23.4694) rotate(-162.739) scale(131.999 2878.14)">
                            <stop stop-color="#fffaed"></stop>
                            <stop offset="1" stop-color="#FFB800"></stop>
                        </radialgradient>
                    </defs>
                </symbol>
        </defs>
        `;
}

if (!document.querySelector('#output')) {
  const output = document.createElement(`div`);
  output.id = `output`;
  document.body.insertAdjacentElement(`afterbegin`, output);
}
console.log(slideIndex);
document.querySelector('#output').innerHTML = window.renderTemplate(data[slideIndex].alias, data[slideIndex].data);
window.postRenderScript(data[slideIndex].alias, data[slideIndex].data);
