import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};

  onClickSort = (event) => {
    this.element.classList.add('sortable-table_loading');
    this.subElements.body.classList.add('sortable-table_empty');

    const targetHeaderCell = event.target.closest('[data-sortable="true"]');

    if (!targetHeaderCell) return;

    const { name: cellName } = targetHeaderCell.dataset;

    const doSorting = (sortingOrder) => {
      targetHeaderCell.dataset.order = sortingOrder;
      this.removeSortingArrow(cellName);
      this.initializeSorting(cellName, sortingOrder);
    }

    switch (targetHeaderCell.dataset.order) {
      case "asc":
        doSorting("desc");
        break;
      case "desc":
        doSorting("asc");
        break;
      default:
        doSorting("asc");
    }
  }

  removeSortingArrow(cellNameToSkip) {
    for (let child of this.subElements.header.children) {
      if (child.dataset.name === cellNameToSkip) {
        continue;
      }
      child.dataset.order = "";
    }
  }

  constructor(headerData, { url } = {}, initSortColumnName) {
    this.headerData = headerData;
    this.data = null;
    this.url = url;
    this.initSortColumnName = initSortColumnName;
    this._getTableHeaderCells();
    this.render();
    this.initEventListeners();
    this.initializeSorting(initSortColumnName);
  }

  initEventListeners() {
    this.subElements.header.addEventListener("click", this.onClickSort);
  }

  removeEventListeners() {
    this.subElements.header.removeEventListener("click", this.onClickSort);
  }

  _getTableHeaderCells() {
    const cells = this.headerData.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    this._cells = cells;
  }

  getTableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerData
          .map(({ id, title, sortable }) => {
            return `
            <div class="sortable-table__cell" data-name='${id}' data-sortable='${sortable}' data-order=''>
              <span>${title}</span>${(sortable)
              ? `<span class="sortable-table__sort-arrow">
                  <span class="sort-arrow"></span>
                </span>` 
              : ""}
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  getTableCells(data) {
    return this._cells
      .map(({ id, template }) => {
        return template
          ? template(data[id])
          : `
          <div class="sortable-table__cell">
            ${data[id]}
          </div>
        `;
      })
      .join("");
  }

  getTableRow(data) {
    return data
      .map(item => {
        return `
          <a href="/products/${item.id}" class="sortable-table__row">
            ${this.getTableCells(item)}
          </a>
        `;
      })
      .join("");
  }

  getTableBody(data) {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getTableRow(data)}
    </div>
    `;
  }

  getTable(data) {
    return `
      <div class="sortable-table sortable-table_loading">
        ${this.getTableHeader()}
        ${this.data ? this.getTableBody(data) : '<div data-element="body" class="sortable-table__body"></div>'}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          No products
        </div>
      </div>
    `;

  }

  getSubElements(element = this.element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  render() {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(this.data);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements();

  }

  async initializeSorting(columnName, order="asc") {
    const headerElements = [...this.subElements.header.children];

    //if columnName is not supplied, pick up middle element of sortable columns for initial sort
    if (!columnName) {
      const sortableColumnNames = headerElements.reduce((accumulator, item) => {
        if (item.dataset.sortable === "true") {
          accumulator.push(item.dataset.name);
        }
        return accumulator;
      }, []);

      columnName = sortableColumnNames[Math.round(sortableColumnNames.length / 2 - 1)];
    }

    await this.getData(columnName, order);

    const headerColumnElement = headerElements.find(item => item.dataset.name === columnName);
    this.sort();
    headerColumnElement.dataset.order = order;
  }

  async getData(columnName, order) {
    const fetchUrl = this.getFetchUrl({columnName: columnName, order: order});

    try {
      const response = await fetchJson(fetchUrl);
      this.data = Object.values(response);
    } catch (error) {
      //TODO: do something better than console.log
      console.log(error);      
    }
  
  }

  getFetchUrl({columnName, order, start = 0, end = 30}) {
    const url = new URL(this.url, BACKEND_URL);
    
    url.searchParams.set("_sort", columnName);
    url.searchParams.set("_order", order);
    url.searchParams.set("_start", start);
    url.searchParams.set("_end", end);

    return url;
  }

    // not needed now as sorting is done on backend side
  sortData(fieldValue, orderValue) {
    const arr = [...this.data];
    const direction = {
      asc: 1,
      desc: -1
    }
    const column = this.headerData.find(item => item.id === fieldValue);
    const {sortType, customSorting} = column;

    return [...arr].sort((a,b) => {
      switch (sortType) {
        case "string":
          return direction[orderValue] * a[fieldValue].localeCompare(b[fieldValue], 'ru', { caseFirst: "upper"})
        case "number":
          return direction[orderValue] * (a[fieldValue] - b[fieldValue])
        case "custom":
          return direction[orderValue] * customSorting(a, b);
        default:
          return direction[orderValue] * (a[fieldValue] - b[fieldValue])
      }
    });
  }

  sort () {
    const sortedTableBody = this.getTableBody(this.data);
    this.subElements.body.innerHTML = sortedTableBody;
    this.element.classList.remove('sortable-table_loading');
    this.subElements.body.classList.remove('sortable-table_empty');
  }

  remove () {
    this.removeEventListeners();
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.subElements = {};
    this.remove();
  }
}
