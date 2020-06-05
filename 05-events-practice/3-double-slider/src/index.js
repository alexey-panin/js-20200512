export default class DoubleSlider {
  element;

  /**
   * WORK IN PROGRESS, DO NOT CHECK YET
   */

  onDragStart = (event) => {
    event.preventDefault();

    const dragable = event.target;
    let shiftX = event.clientX - dragable.getBoundingClientRect().left;
    console.log(shiftX);
  }

  constructor(
    { 
      min = 0, 
      max = 100, 
      formatValue = value => '£' + value, 
      selected = {from: min, to: max}
    } = {}) 
  {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
    this.initEventListeneres();
  }

  initEventListeneres() {
    const thumbLeft = this.subElements.thumb_left;
    const thumbRight = this.subElements.thumb_right;

    thumbLeft.addEventListener("pointerdown", this.onDragStart);
    thumbRight.addEventListener("pointerdown", this.onDragStart);
  }

  getSliderTemplate(min, max, formatValue, {from, to} = {}) {
    const thumbLeft = (from - min) / (max - min) * 100;
    const thumbRight = 100 - (to - min) / (max - min) * 100;

    return `
      <div class="range-slider">
        <span data-element="min">${formatValue(min)}</span>
        <div class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${thumbLeft}%; right: ${thumbRight}%"></span>
          <span data-element="thumb_left" class="range-slider__thumb-left" style="left: ${thumbLeft}%"></span>
          <span data-element="thumb_right" class="range-slider__thumb-right" style="right: ${thumbRight}%"></span>
        </div>
        <span data-element="max">${formatValue(max)}</span>
      </div>
    `;
  }

  render() {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getSliderTemplate(this.min, this.max, this.formatValue, this.selected);

    const element = wrapper.firstElementChild;

    this.element = element;

    this.subElements = this.getSubElements(element);

  }

  getSubElements(element = this.element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }
  

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
