export default class SortableTable {
  static activeTableBody;
  element;

  constructor(headerData, { data } = {}) {
    this.headerData = headerData;
    this.data = data;
    this.render();
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

  get subElements() {
    return {
        header : this.getTableHeader(this.headerData),
        body : this.getTableBody(this.data)
    }
  }

  render() {

    this._getTableHeaderCells();

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable(this.data);

    const element = wrapper.firstElementChild;

    this.element = element;
  }

  sort(fieldValue, orderValue, arr = this.data) {
    let sortedArray = [];
    const direction = {
      asc: 1,
      desc: -1
    }

    if (this._sortTypes[fieldValue] === "string") {
      sortedArray = [...arr].sort((a, b) =>
        direction[orderValue] * a[fieldValue].localeCompare(b[fieldValue], 'default', { caseFirst: "upper"}));
    } else {
      sortedArray = [...arr].sort((a, b) => 
        direction[orderValue] * (a[fieldValue] - b[fieldValue]));
    }

    let sortedTableBody = this.getTableBody(sortedArray);

    //SortableTable.activeTableBody.replaceWith(sortedTableBody);

    //SortableTable.activeTableBody = sortedTableBody;

  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
