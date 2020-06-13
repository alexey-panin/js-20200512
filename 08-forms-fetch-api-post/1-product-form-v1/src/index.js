//import SortableList from '../../../09-tests-routes-browser-history-api/2-sortable-list/solution/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import productData from './__mocks__/product-data.js';
import categoryData from './__mocks__/categories-data.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element; //html element
  productData = productData;
  categoryData = categoryData;

  constructor(productId) {
    this.productId = productId;
    this.productEditMode = Boolean(this.productId);
  }

  render() {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getFormTemplate(this.productData);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements();
    console.log(this.productData);
    console.log(this.categoryData);

  }

  getSubElements(element = this.element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getFormTemplate([productData]) {
    return `
    <div class="product-form">
      <form data-element="productForm" class="form-grid">
        ${this.getTitleTemplate(productData)}
        ${this.getDescriptionTemplate()}
        ${this.getSortableListContainerTemplate()}
      </form>
    </dib>
    `;
  }

  getTitleTemplate(productData) {
    return `
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value=${this.productEditMode ? escapeHtml(productData.title) : ""}>
        </fieldset>
      </div>
    `;
  }

  getDescriptionTemplate() {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>
    `;
  }

  getSortableListContainerTemplate() {
    return `
    <div class="form-group form-group__wide" data-element="sortable-list-container">
      <label class="form-label">Фото</label>
      <div data-element="imageListContainer">
        ${this.getSortableListTemplate()}
      </div>
      <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
    </div>
    `;
  }

  getSortableListTemplate() {
    return `
      <ul class="sortable-list">
        ${this.getSortableListRowTemplate()}
      </ul>
    `;
  }

  getSortableListRowTemplate() {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
        <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
        <span>
          <img src="icon-grab.svg" data-grab-handle alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
          <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle alt="delete">
        </button>
      </li>
    `;
  }

}
