import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    url = 'api/dashboard/sales',
    range = 
    {
        from: new Date('2020-04-06'),
        to: new Date('2020-05-06'),
    },
    label = '',
    formatHeading = data => `$${data}`,
    link = '',
    value = 0
  } = {}) {
    this.data = [];
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.value = value;
    //TODO: TEMPORARY. figure out about this base url
    this.baseUrl = "https://course-js.javascript.ru/";
    
    this.render();
    this.getData();
  }

  async getData() {
    // mockup
    //this.data = [21, 21, 3, 19, 21, 7, 13, 20, 15, 5, 18, 18, 4, 13, 19, 13, 7, 22, 19, 4, 22, 19, 3, 23, 16, 4, 17, 19, 2, 20, 17];
    const { from, to } = this.range;
    const fetchUrl = `${this.baseUrl}${this.url}?from=${from}&to=${to}`

    try {
      const response = await fetchJson(fetchUrl);
      this.data = Object.values(response);      
    } catch (error) {
      console.log(error);      
    }

    const arrSum = arr => arr.reduce((a, b) => a + b, 0);

    this.value = arrSum(this.data);

    this.update({
      headerData: this.value,
      bodyData: this.data
    });
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);

    return data
    .map(item => {
      const scale = this.chartHeight / maxValue;
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    })
    .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading(this.value)}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update({headerData, bodyData}) {
    this.subElements.header.textContent = this.formatHeading(headerData);
    this.subElements.body.innerHTML = this.getColumnBody(bodyData);

    if (bodyData.length) {
      this.element.classList.remove('column-chart_loading');
    }
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
