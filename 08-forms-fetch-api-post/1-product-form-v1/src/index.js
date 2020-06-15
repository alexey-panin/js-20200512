//import SortableList from '../../../09-tests-routes-browser-history-api/2-sortable-list/solution/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element; //html element
  inputElement; //html element
  productData = null;
  // TODO: check is there is sence to include imported staff as a class property?
  // e.g. escapeHtml = escapeHtml
  categories = null;

  onSubmitPatchProductData = async (event) => {
    event.preventDefault();

    const {productForm} = this.subElements;
    const formData = new FormData(productForm);
    const fetchUrl = this.getFetchUrl(this.productsUrl);

    const requestParams = {
      method: 'PATCH',
      headers:             {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    }

    //TODO: change url back to fetchUrl variable
    await this.doFetchComplexRequest ("http://course-js.javascript.ru/api/rest/products", requestParams);

    //==============requestBin settings=====================

/*     const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const body = { "name": "Han Solo" }

    const options = {
      method: "POST",
      headers,
      mode: "cors",
      body: formData,
    }

    fetch("https://en7rsmrm11lcj.x.pipedream.net/", options) */

    //============end of requestBin settings==================
  }

  onSubmitPostProductData = async (event) => {
    event.preventDefault();
    const {productForm} = this.subElements;
    const formData = new FormData(productForm);
    const fetchUrl = this.getFetchUrl(this.productsUrl);

    const requestParams = {
      method: 'POST',
      body: formData
    }

    //TODO: change url back to fetchUrl variable
    await this.doFetchComplexRequest ("http://course-js.javascript.ru/api/rest/products", requestParams);
  }

  uploadImage = async () => {
    const file = this.inputElement.files[0];

    const formData = new FormData();
    formData.append('image', file);

    try {
      return await fetchJson('https://api.imgur.com/3/image', {
        method: 'POST',
        headers:             {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
      });
    } catch (err) {
      throw err;
    }

  }

  onUploadImageButtonClick = (event) => {
    event.preventDefault();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<input type="file" accept="image/*" hidden="">'
    this.inputElement = wrapper.firstElementChild;
    document.body.append(this.inputElement);

    this.inputElement.onchange = this.uploadImage;

    this.inputElement.click();
  }

  async doFetchComplexRequest(fetchUrl, requestParams) {
    try {
      return await fetchJson(fetchUrl, requestParams);
    } catch (err) {
      throw err;
    }
  }

  // TODO: check if it is a good place for url param or it should be put outside of class
  constructor(productId, url = "api/rest/products") {
    this.productId = productId;
    this.productEditMode = Boolean(this.productId);
    this.productsUrl = url;
    //TODO: where better to put it? Should it come as a params when creating a new ProductForm?
    this.categoriesUrl = "api/rest/categories";
  }

  async render() {

    const wrapper = document.createElement('div');

    [this.categories, this.productData] = await this.getAllData(this.productEditMode);

    if (this.productEditMode) {
      wrapper.innerHTML = this.getEditProductFormTemplate(this.productData, this.categories);
    } else {
      wrapper.innerHTML = this.getCreateProductFormTemplate(this.categories);
    }

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements();

    this.initEventListeners();

  }

  initEventListeners() {
    const uploadImageButton = this.subElements["sortable-list-container"].lastElementChild;

    uploadImageButton.addEventListener("click", this.onUploadImageButtonClick);
    this.element.addEventListener("submit", (this.productEditMode) ? this.onSubmitPatchProductData : this.onSubmitPostProductData);
  }

  async getAllData(productEditMode) {
    const categoriesRequest = this.getSingleData(this.categoriesUrl, {_sort: "weight", _refs: "subcategory"});

    const requests = [
      categoriesRequest
    ]

    if (productEditMode) {
      const productRequest = this.getSingleData(this.productsUrl, {id: this.productId});
      requests.push(productRequest);
    }

    return await Promise.all(requests)
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

    if (searchQueryParams) {
      for (let [param, val] of Object.entries(searchQueryParams)) {
        fetchUrl.searchParams.set(param, val);
      }
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

  getEditProductFormTemplate([productData], categories) {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          ${this.getTitleTemplate(productData)}
          ${this.getDescriptionTemplate(productData)}
          ${this.getSortableListContainerTemplate(productData)}
          ${this.getProductCategoriesTemplate(categories, productData)}
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
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(title)}">
        </fieldset>
      </div>
    `;
  }

  getDescriptionTemplate({description}) {
    return `
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(description)}"</textarea>
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
            <input type="hidden" name="url" value="${url}">
            <input type="hidden" name="source" value="${source}">
            <span>
              <img src="icon-grab.svg" data-grab-handle alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${url}">
              <span>${source}</span>
            </span>
            <button type="button">
              <img src="icon-trash.svg" data-delete-handle alt="delete">
            </button>
          </li>
        `;
      }).join("");
  }

  getProductCategoriesTemplate(categories, productData) {
    let productSubcategory;
    if (productData) {
      ({subcategory: productSubcategory} = productData);
    }
    return `
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
        ${categories
          .map( ({title: categotyTitle, subcategories}) => {
            return subcategories
              .map( ({id: subcategoryId, title: subcategoryTitle}) => {
                return `
                  <option ${(productSubcategory && productSubcategory === subcategoryId) ? "selected" : ""} value="${subcategoryId}">${categotyTitle} &gt; ${subcategoryTitle}</option>
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
          <input required="" type="number" name="price" class="form-control" placeholder="100" value="${price}">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0" value="${discount}">
        </fieldset>
      </div>
    `;
  }

  getProductQuantityTemplate({quantity}) {
    return `
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1" value="${quantity}">
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

  getCreateProductFormTemplate(categories) {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer"><ul class="sortable-list"></ul></div>
          <button type="button" name="uploadImage" class="button-primary-outline fit-content"><span>Загрузить</span></button>
        </div>
        ${this.getProductCategoriesTemplate(categories)}
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required="" type="number" class="form-control" name="quantity" placeholder="1">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            Добавить товар
          </button>
        </div>
      </form>
      </div>
    `;
  }

}
