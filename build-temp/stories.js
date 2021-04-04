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
