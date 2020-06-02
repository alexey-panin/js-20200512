export default class SortableTable {
  element;
  subElements = {};

  constructor(headerData, { data } = {}, initSortColumnName) {
    this.headerData = headerData;
    this.initSortColumnName = initSortColumnName;
    this.data = data;
    this._getTableHeaderCells();
    this.render();
    this.initEventListeners();
    this.initializeSorting(initSortColumnName);
  }

  initEventListeners() {

    const eventListenerCallback = (event) => {
      const targetDiv = event.path.find(item => item.dataset.name);
      const columnName = targetDiv.dataset.name;

      const doSorting = (sortingOrder) => {
        this.sort(columnName, sortingOrder);
        targetDiv.dataset.order = sortingOrder;
      }

      switch (targetDiv.dataset.order) {
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

    for (let item of this.subElements.header.children) {
      if (item.dataset.sortable === "true") {
        item.addEventListener("click", eventListenerCallback);
      }
    }
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
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
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

  sort (fieldValue, orderValue) {
    const sortedData = this.sortData(fieldValue, orderValue);
    const sortedTableBody = this.getTableBody(sortedData);
    this.subElements.body.innerHTML = sortedTableBody;

    // remove sorting arrow from other columns
    for (let child of this.subElements.header.children) {
      if (child.dataset.name === fieldValue) {
        continue;
      }
      child.dataset.order = "";
    }
  }

  initializeSorting(columnName, order="asc") {
    const headerElements = Array.from(this.subElements.header.children);
    let sortableColumnNames = [];
    let headerColumnElement = [];

    //if columnName is not supplied, pick up middle element of sortable columns for initial sort
    if (!columnName) {
      sortableColumnNames = headerElements.reduce((accumulator, item) => {
        if (item.dataset.sortable === "true") {
          accumulator.push(item.dataset.name);
        }
        return accumulator;
      }, []);

      columnName = sortableColumnNames[Math.round(sortableColumnNames.length / 2 - 1)];
    }

    headerColumnElement = headerElements.find(item => item.dataset.name === columnName);
    this.sort(columnName, order);
    headerColumnElement.dataset.order = "asc";
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
