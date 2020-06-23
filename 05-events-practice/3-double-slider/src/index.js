export default class DoubleSlider {
  element; //html element
  dragableThumb; //html element
  position = {
    shiftX: 0,
    sliderLeft: 0,
  };

  thumbPositionInPercent = {
    thumbLeft: null,
    thumbRight: null
  };

  onPointerDown = (event) => {
    event.preventDefault();

    const { target: dragableThumb, clientX } = event;
    const { innerSlider } = this.subElements;

    //Get initial position
    this.position.shiftX = clientX - dragableThumb.getBoundingClientRect().left;
    this.position.sliderLeft = innerSlider.getBoundingClientRect().left;

    this.dragableThumb = dragableThumb;

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  onPointerMove = (event) => {

    console.log(this.thumbPositionInPercent);

    const { clientX } = event;

    // will be either thumbLeft of thumbRight
    const { element: dataSetElementValue } = this.dragableThumb.dataset;
    const { shiftX, sliderLeft } = this.position;
    const { innerSlider, thumbLeft, thumbRight} = this.subElements;
    const { left: innerLeft, right: innerRight, width } = innerSlider.getBoundingClientRect();

    let newLeft = +((clientX - shiftX - sliderLeft) / width * 100).toFixed(1);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    if (newLeft < 0) {
      newLeft = 0;
    }

    const rightEdge = width - thumbLeft.offsetWidth;


    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    switch (dataSetElementValue) {
      case "thumbLeft":
        this.dragableThumb.style.left = `${newLeft}%`;
        break;
      case "thumbRight":
        this.dragableThumb.style.right = `${newLeft}%`;
        break;
    }

    this.thumbPositionInPercent[dataSetElementValue] = newLeft;

    this.subElements.progress.style.cssText = `left: ${this.thumbPositionInPercent.thumbLeft}%; right: ${this.thumbPositionInPercent.thumbRight}%`

    console.log(this.thumbPositionInPercent);

  }

  onPointerUp = (event) => {
    console.log("pointer is up");
    this.removeListeners();
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
    this.thumbPositionInPercent.thumbLeft = selected.from; 
    this.thumbPositionInPercent.thumbRight = selected.to; 
    this.render();
    this.initEventListeneres();
  }

  initEventListeneres() {
    const { thumbLeft, thumbRight } = this.subElements;

    thumbLeft.addEventListener("pointerdown", this.onPointerDown);
    thumbRight.addEventListener("pointerdown", this.onPointerDown);
  }

  removeListeners () {
    document.removeEventListener('pointerup', this.onPointerUp);
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  getSliderTemplate(min, max, formatValue, {from, to} = {}) {
    this.thumbPositionInPercent.thumbLeft = +((from - min) / (max - min) * 100).toFixed(1);
    this.thumbPositionInPercent.thumbRight = +(100 - (to - min) / (max - min) * 100).toFixed(1);

    return `
      <div class="range-slider">
        <span data-element="min">${formatValue(min)}</span>
        <div data-element="innerSlider" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${this.thumbPositionInPercent.thumbLeft}%; right: ${this.thumbPositionInPercent.thumbRight}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${this.thumbPositionInPercent.thumbLeft}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${this.thumbPositionInPercent.thumbRight}%"></span>
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
