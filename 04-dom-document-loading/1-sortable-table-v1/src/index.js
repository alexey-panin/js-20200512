export default class SortableTable {
  static activeTableBody;
  element;

  constructor(headerData, { data } = {}) {
    this.headerData = headerData;
    this.data = data;
    this.render();
  }

/*   getTableHeaderTemplate(headerData) {
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
  } */

  getTableHeader(headerData) {
/*     const tableHeader = document.createElement("div");
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
    console.log(tableHeader);
    return tableHeader; */
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${headerData
          .map(({ id, title, sortable }) => {
            return `
            <div class="sortable-table__cell" data-name='${id}' data-sortable='${sortable}'>
              <span>${title}</span>${(sortable)?`
              <span class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
              </span>` : ""}
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  getTableRowTemplate(productData) {
    const tableRow = document.createElement("a");
    tableRow.setAttribute("href", `/products/${productData.id}`);
    tableRow.className = "sortable-table__row";

    let tableColumns = '';

    const cells = this.headerData.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    for (let { id, template } of cells) {
      if (template) {
        tableColumns += template(productData[id]);
        continue;
      }

      tableColumns += `<div class="sortable-table__cell">${productData[id]}</div>`

    }

    tableRow.insertAdjacentHTML("beforeend", tableColumns);

    return tableRow;



  

/*     return `
    <a href="/products/${productData.id}" class="sortable-table__row">
      <div class="sortable-table__cell">
        <img class="sortable-table-image" alt="Image" src=${(productData.images)? productData.images[0].url : ""}></div>
      <div class="sortable-table__cell">${productData.title}</div>
      <div class="sortable-table__cell">${productData.quantity}</div>
      <div class="sortable-table__cell">${productData.price}</div>
      <div class="sortable-table__cell">${productData.sales}</div>
    </a>
    `; */
  }

  getTableBody(tableData) {
    const tableBody = document.createElement("div");
    tableBody.setAttribute("data-element", "body");
    tableBody.className = "sortable-table__body";

    for (let item of tableData) {
      //tableBody.insertAdjacentHTML("beforeend", this.getTableRowTemplate(item));
      tableBody.append(this.getTableRowTemplate(item));
    }

    return tableBody;
  }

  get subElements() {
    return {
        header : this.getTableHeader(this.headerData),
        body : this.getTableBody(this.data)
    }
  }

  render() {
    const table = document.createElement("div");
    table.className="sortable-table";

    const tableHeader = this.getTableHeader(this.headerData);
    const tableBody = this.getTableBody(this.data);

    SortableTable.activeTableBody = tableBody;

    //table.insertAdjacentHTML("beforeend", tableHeader);
    table.innerHTML = tableHeader;
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
