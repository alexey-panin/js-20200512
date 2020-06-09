import ColumnChart_1 from './ColumnChart.js';
import fetchJson from './utils/fetch-json.js';

export default class ColumnChart extends ColumnChart_1 {

  constructor({
    url = 'api/dashboard/sales',
    range = 
    {
        from: new Date('2020-04-06'),
        to: new Date('2020-05-06'),
    },
    label = '',
    formatHeading = data => `$${data}`,
    link = ''
  } = {}) {
    super();
    this.data = [];
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.value = null;
    //TODO: TEMPORARY. figure out about this base url
    this.baseUrl = "https://course-js.javascript.ru/"
    this.getData();
  }

  async getData() {
    const { from, to } = this.range;
    const fetchUrl = `${this.baseUrl}${this.url}?from=${from}&to=${to}`

    try {
      const response = await fetchJson(fetchUrl);
      this.data = Object.values(response);
    } catch (error) {
      console.log(error);      
    }

    this.render();
  }


}
