export default class SortableTable {
  element;
  subElements = {};

  constructor(headerData, { data } = {}) {
    this.headerData = headerData;
    this.data = data;
    this._getTableHeaderCells();
    this.render();
    this.subElements = this.getSubElements();
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
            <div class="sortable-table__cell" data-name='${id}' data-sortable='${sortable}'>
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
  }

  sortData(fieldValue, orderValue) {
    const arr = [...this.data];
    const direction = {
      asc: 1,
      desc: -1
    }
    let sortType;
    const column = this.headerData.find(item => item.id === fieldValue && item.sortable === true);

    if (column) {
      ({ sortType } = column);
    } else {
      throw new Error("item is not sortable");
    }

    return [...arr].sort((a,b) => {
      switch (sortType) {
        case "string":
          return direction[orderValue] * a[fieldValue].localeCompare(b[fieldValue], 'ru', { caseFirst: "upper"})
        case "number":
          return direction[orderValue] * (a[fieldValue] - b[fieldValue])      
        default:
          return direction[orderValue] * (a[fieldValue] - b[fieldValue])
      }
    });
  }

  sort (fieldValue, orderValue) {
    const sortedData = this.sortData(fieldValue, orderValue);
    const sortedTableBody = this.getTableBody(sortedData);
    this.subElements.body.innerHTML = sortedTableBody;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
