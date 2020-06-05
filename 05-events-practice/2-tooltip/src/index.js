class Tooltip {
  element = null;
  tooltipShiftFromCursor = 7;

  elementOnPointerMoveShowTooltip = (event) => {
    this.element.style.cssText = `left: ${event.clientX + this.tooltipShiftFromCursor}px; top: ${event.clientY + this.tooltipShiftFromCursor}px;`
  }

  documentOnPointerOverShowTooltip = (event) => {
    //const target = event.target;
    const { target } = event;

    if (target.dataset.tooltip) {
      const tooltipHtml = target.dataset.tooltip;

      this.render(tooltipHtml, 
        {
          coordinateX: event.clientX,
          coordinateY: event.clientY
        }
      );   
      target.addEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
    }
  }

  documentOnPointerOutRemoveTooltip = (event) => {
    // элемент с которого ушел курсор
    //const elementFrom = event.target;
    const { target: elementFrom } = event;

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

  render(tooltipData, coordinates) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTooltip(tooltipData, coordinates);

    const element = wrapper.firstElementChild;

    this.element = element;

    document.body.append(element);

  }

  getTooltip(tooltipMessage, { coordinateX, coordinateY } = {}) {
    return `
      <div class="tooltip" style="left: ${coordinateX + this.tooltipShiftFromCursor}px; top: ${coordinateY + this.tooltipShiftFromCursor}px;">${tooltipMessage}</div>
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