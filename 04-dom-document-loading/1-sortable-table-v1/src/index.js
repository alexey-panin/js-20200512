export default class SortableTable {
  static activeTableBody;
  element;

  constructor(headerData, data) {
    this.headerData = headerData;
    this.data = data.data;
    this.render();
  }

  getTableHeaderTemplate(...headerDataArr) {
    const headerData = headerDataArr[0];
    const insertSortArrow = () => {
        return `
          <span class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        `;
    }

    return `
        <div class="sortable-table__cell" data-name=${headerData.id} data-sortable=${headerData.sortable}>
          <span>${headerData.title}</span>
          ${(headerData.sortable)? insertSortArrow() : ""}
        </div>
    `;
  }

  getTableHeader(headerData) {
    const tableHeader = document.createElement("div");
    tableHeader.setAttribute("data-element", "header");
    tableHeader.className = "sortable-table__header sortable-table__row";

    let sortTypes = {};

    for (let item of headerData) {
      tableHeader.insertAdjacentHTML("beforeend", this.getTableHeaderTemplate(item));

      if (item.sortable) {
        sortTypes[item.id] = item.sortType;
      }
    }

    this._sortTypes = sortTypes;

    return tableHeader;
  }

  getTableRowTemplate(...productData) {
    const singleProductData = productData[0];

    return `
    <a href="/products/${singleProductData.id}" class="sortable-table__row">
      <div class="sortable-table__cell">
        <img class="sortable-table-image" alt="Image" src=${singleProductData.images[0].url}></div>
      <div class="sortable-table__cell">${singleProductData.title}</div>
      <div class="sortable-table__cell">${singleProductData.quantity}</div>
      <div class="sortable-table__cell">${singleProductData.price}</div>
      <div class="sortable-table__cell">${singleProductData.sales}</div>
    </a>
    `;
  }

  getTableBody(tableData) {
    const tableBody = document.createElement("div");
    tableBody.setAttribute("data-element", "body");
    tableBody.className = "sortable-table__body";

    for (let item of tableData) {
      tableBody.insertAdjacentHTML("beforeend", this.getTableRowTemplate(item));
    }

    return tableBody;
  }

  render() {
    const table = document.createElement("div");
    table.className="sortable-table";

    const tableHeader = this.getTableHeader(this.headerData);
    const tableBody = this.getTableBody(this.data);

    SortableTable.activeTableBody = tableBody;

    table.append(tableHeader);
    table.append(tableBody);

    this.element = table;
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

    SortableTable.activeTableBody.replaceWith(sortedTableBody);

    SortableTable.activeTableBody = sortedTableBody;

  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
