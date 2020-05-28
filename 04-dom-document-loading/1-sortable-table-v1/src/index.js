export default class SortableTable {
  element; // HTMLElement;

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
          ${(headerData.id === "title")? insertSortArrow() : ""}
        </div>
    `;
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

  render(sortedArray) {
    const table = document.createElement("div");
    table.className="sortable-table";

    const tableHeader = document.createElement("div");
    tableHeader.setAttribute("data-element", "header");
    tableHeader.className = "sortable-table__header sortable-table__row";
    for (let item of this.headerData) {
      tableHeader.insertAdjacentHTML("beforeend", this.getTableHeaderTemplate(item));
    }

    const tableBody = document.createElement("div");
    tableBody.setAttribute("data-element", "body");
    tableBody.className = "sortable-table__body";


    let tableData = this.data;
    if (sortedArray) {
      tableData = sortedArray;
    }

    for (let item of tableData) {
      tableBody.insertAdjacentHTML("beforeend", this.getTableRowTemplate(item));
    }

    table.append(tableHeader);
    table.append(tableBody);

    this.element = table;

    return this.element;
  }

  sort(fieldValue, orderValue, arr = this.data) {

    let sortedArray = [];
    const direction = {
      asc: 1,
      desc: -1
    }

    sortedArray = [...arr].sort((a, b) => 
      direction[orderValue] * (a.price - b.price));

    console.log(sortedArray);
    console.log(this.render(sortedArray));
    //TODO: replace this with static property where you save link to the table body
    document.querySelector(".sortable-table").replaceWith(this.render(sortedArray));

  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
