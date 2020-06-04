export default class DoubleSlider {
  element;

  constructor({ min, max, formatValue, selected } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
  }

  getSliderTemplate(min=10, max=100, formatValue = value => '$' + value, {from, to} = {}) {
    const thumbLeft = (from - min) / (max - min) * 100;
    const thumbRight = 100 - (to - min) / (max - min) * 100;

    return `
      <div class="range-slider">
        <span>${formatValue(min)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${thumbLeft}%; right: ${thumbRight}%"></span>
          <span class="range-slider__thumb-left" style="left: ${thumbLeft}%"></span>
          <span class="range-slider__thumb-right" style="right: ${thumbRight}%"></span>
        </div>
        <span>${formatValue(max)}</span>
      </div>
    `;
  }

  render() {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getSliderTemplate(this.min, this.max, this.formatValue, this.selected);

    const element = wrapper.firstElementChild;

    this.element = element;

  }
}
