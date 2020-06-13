//import SortableList from '../../../09-tests-routes-browser-history-api/2-sortable-list/solution/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element; //html element
  productData = null;
  // TODO: check is there is sence to include imported staff as a class property?
  categories = null;

  // TODO: check if it is a good place for url param or it should be put outside of class
  constructor(productId, url = "api/rest/products") {
    this.productId = productId;
    //TODO: fix this when productEditMode is false
    this.productEditMode = Boolean(this.productId);
    this.productsUrl = url;
    //TODO: where better to put it? Should it come as a params when creating a new ProductForm?
    this.categoriesUrl = "api/rest/categories";
  }

  async render() {

    [this.categories, this.productData] = await this.getAllData();

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getFormTemplate(this.productData, this.categories);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements();

  }

  async getAllData() {
    const categoriesRequest = this.getSingleData(this.categoriesUrl, {_sort: "weight", _refs: "subcategory"});
    const productDataRequest = this.getSingleData(this.productsUrl, {id: this.productId});

    return await Promise.all([categoriesRequest, productDataRequest])
      .then(responses => {
        return responses;
      });
  }

  async getSingleData(url, searchQueryParams) {
    const fetchUrl = this.getFetchUrl(url, searchQueryParams);
    const response = await fetchJson(fetchUrl);
    return response;
  }

  getFetchUrl(url, searchQueryParams) {
    const fetchUrl = new URL(url, BACKEND_URL);
    for (let [param, val] of Object.entries(searchQueryParams)) {
      fetchUrl.searchParams.set(param, val);
    }
    return fetchUrl;
  }

  getSubElements(element = this.element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getFormTemplate([productData], categories) {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          ${this.getTitleTemplate(productData)}
          ${this.getDescriptionTemplate(productData)}
          ${this.getSortableListContainerTemplate(productData)}
          ${this.getProductCategoriesTemplate(productData, categories)}
          ${this.getProductPriceDiscountTemplate(productData)}
          ${this.getProductQuantityTemplate(productData)}
          ${this.getProductStatusTemplate(productData)}
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getTitleTemplate({title}) {
    return `
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${this.productEditMode ? escapeHtml(title) : ""}">
        </fieldset>
      </div>
    `;
  }

  getDescriptionTemplate({description}) {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.productEditMode ? escapeHtml(description) : ""}"</textarea>
      </div>
    `;
  }

  getSortableListContainerTemplate(productData) {
    return `
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          ${this.getSortableListTemplate(productData)}
        </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
    `;
  }

  getSortableListTemplate(productData) {
    return `
      <ul class="sortable-list">
        ${this.getSortableListRowTemplate(productData)}
      </ul>
    `;
  }

  getSortableListRowTemplate({images}) {
    return images
      .map( ({url, source}) => {
        return `
          <li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${this.productEditMode ? url : ""}">
            <input type="hidden" name="source" value="${this.productEditMode ? source : ""}">
            <span>
              <img src="icon-grab.svg" data-grab-handle alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${this.productEditMode ? url : ""}">
              <span>${this.productEditMode ? source : ""}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle alt="delete">
            </button>
          </li>
        `;
      }).join("");
  }

  getProductCategoriesTemplate({subcategory: productSubcategory}, categories) {
    return `
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
        ${categories
          .map( ({title: categotyTitle, subcategories}) => {
            return subcategories
              .map( ({id: subcategoryId, title: subcategoryTitle}) => {
                return `
                  <option ${(productSubcategory === subcategoryId) ? "selected" : ""} value="${this.productEditMode ? subcategoryId : ""}">${this.productEditMode ? categotyTitle : ""} &gt; ${this.productEditMode ? subcategoryTitle : ""}</option>
                `;
              });
          }).join("")}
        </select>
      </div>
    `;
  }

  getProductPriceDiscountTemplate({price, discount}) {
    return `
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100" value="${this.productEditMode ? price : ""}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.productEditMode ? discount : ""}">
        </fieldset>
      </div>
    `;
  }

  getProductQuantityTemplate({quantity}) {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.productEditMode ? quantity : ""}">
      </div>
    `;
  }

  getProductStatusTemplate({status}) {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option ${(status === 1) ? "selected" : ""} value="1">Активен</option>
          <option ${(status === 0) ? "selected" : ""} value="0">Неактивен</option>
        </select>
      </div>
    `;
  }

}
