class Tooltip {
  element = null;

  elementOnPointerMoveShowTooltip = (event) => {
    this.element.style.cssText = `left: ${event.clientX + 10}px; top: ${event.clientY + 10}px;`
  }

  documentOnPointerOverShowTooltip = (event) => {
    const target = event.target;

    if (target.dataset.tooltip) {
      const tooltipHtml = target.dataset.tooltip;

      this.render(tooltipHtml, event.clientX, event.clientY);   
      target.addEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
    }
  }

  documentOnPointerOutRemoveTooltip = (event) => {
    // элемент с которого ушел курсор
    const elementFrom = event.target;

    if (this.element) {
      this.remove();
      this.element = null;
    }

    elementFrom.removeEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
  }

  constructor() {
    // turning a class into a singleton
    if (Tooltip.instance instanceof Tooltip) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener("pointerover", this.documentOnPointerOverShowTooltip);
    document.addEventListener("pointerout", this.documentOnPointerOutRemoveTooltip);
  }

  remove() {
    this.element.remove();
    this.element = null;
  }

  render(tooltipData, coordinateX, coordinateY) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTooltip(tooltipData, coordinateX, coordinateY);

    const element = wrapper.firstElementChild;

    this.element = element;

    document.body.append(element);

  }

  getTooltip(tooltipMessage, coordinateX, coordinateY) {
    return `
      <div class="tooltip" style="left: ${coordinateX + 10}px; top: ${coordinateY + 10}px;">${tooltipMessage}</div>
    `;
  }

  destroy() {
    document.removeEventListener("pointerover", this.documentOnPointerOverShowTooltip);
    document.removeEventListener("pointerout", this.documentOnPointerOutRemoveTooltip);
    this.remove(); 
  }
}

const tooltip = new Tooltip();

export default tooltip;