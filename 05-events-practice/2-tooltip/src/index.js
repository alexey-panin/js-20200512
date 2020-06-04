class Tooltip {
  element = null;
  elementWithTooltip = null;

  onPointerOverShowTooltip = (event) => {
    const tooltipData = event.target.dataset.tooltip;
    this.render(tooltipData, event.clientX, event.clientY);

  }

  onPointerOutRemoveTooltip = () => {

  }

  onPointerMoveShowTooltip = (event) => {

/*     let relatedTarget = event.relatedTarget;

    console.log(event.relatedTarget);

    while (relatedTarget) {
      // поднимаемся по дереву элементов и проверяем – внутри ли мы currentElem или нет
      // если да, то это переход внутри элемента – игнорируем
      if (relatedTarget == currentElem) return;
  
      relatedTarget = relatedTarget.parentNode;
    } */

    console.log("pointer move");

    this.element.style.cssText = `left: ${event.clientX}px; top: ${event.clientY}px;`
  }

  remove = () => {
    //this.removeEventListeners();
    console.log("removed");
    this.element.remove();
  }

  documentOnPointerOverShowTooltip = (event) => {
    if (event.target.dataset.tooltip) {

      const tooltipHtml = event.target.dataset.tooltip;
      const target = event.target;

      if (this.elementWithTooltip === target) return;
  
      this.render(tooltipHtml, event.clientX, event.clientY);
  
      target.addEventListener("pointermove", this.onPointerMoveShowTooltip);

      this.elementWithTooltip = target;

      console.log("document pointer over");
    }

    //console.log(event.target);
    //event.target.addEventListener("pointerover", this.onPointerOverShowTooltip);
    //event.target.addEventListener("pointermove", this.onPointerMoveShowTooltip);
    //event.target.removeEventListener("pointerout", this.onPointerOverShowTooltip);
    //event.target.addEventListener("pointerout", this.remove);
  }

  documentOnPointerOutRemoveTooltip = (event) => {

    //let target = event.target;
    const tooltipAnchorElement = event.target.closest('[data-tooltip]');

    if (!tooltipAnchorElement) return;
    console.log(tooltipAnchorElement);

    console.log(event.relatedTarget);

/*     while (relatedTarget) {
      // поднимаемся по дереву элементов и проверяем – внутри ли мы currentElem или нет
      // если да, то это переход внутри элемента – игнорируем
      if (relatedTarget === this.elementWithTooltip) return;
  
      relatedTarget = relatedTarget.parentNode;
    } */

    //if (target === this.elementWithTooltip) return;

    // если курсор покинул элемент внутри того же самого дива, игнорируем
    //if (tooltipAnchorElement === this.elementWithTooltip) return;
    console.log(tooltipAnchorElement === this.elementWithTooltip);


    console.log("document pointer out");

    if (this.element) {
      this.remove();
      this.element = null;
      this.elementWithTooltip = null;
    }
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

  remove = () => {
    //this.removeEventListeners();
    this.element.remove();
    this.element = null;
  }

  render(tooltipData, coordinateX, coordinateY) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTooltip(tooltipData, coordinateX, coordinateY);

    const element = wrapper.firstElementChild;

    this.element = element;

    //console.log(element);

    document.body.append(element);

  }

  getTooltip(tooltipMessage, coordinateX, coordinateY) {
    return `
      <div class="tooltip" style="left: ${coordinateX + 10}px; top: ${coordinateY + 10}px;">${tooltipMessage}</div>
    `;
  }

  destroy() {
    //this.removeEventListeners();
    //this.subElements = {};
    this.remove();
    document.removeEventListener('pointer', this.documentOnPointerOverShowTooltip); 
  }



}

const tooltip = new Tooltip();

export default tooltip;


/* class Tooltip {
  element;
  elementWithTooltip;

  onEnter = (event) => {
      if (event.target.dataset.tooltip != undefined) { 
          this.elementWithTooltip = event.target;
          this.element.textContent = `${event.target.dataset.tooltip}`;

          event.target.addEventListener('pointermove', this.onMove);
      }
  }

  onMove = (event) => {
      this.element.classList.remove('hide');
      this.element.style.left = event.clientX + 5 + 'px';
      this.element.style.top = event.clientY + 5 + 'px';

      this.elementWithTooltip.addEventListener('pointerout', this.onLeave);
  }

  onLeave = (event) => {
      this.element.classList.add('hide');
      this.elementWithTooltip.removeEventListener('pointerout', this.onLeave);
      this.elementWithTooltip.removeEventListener('pointermove', this.onMove)
  }

  constructor() {
    this.render();
  }

  getTemplate() {
      return `<div class="tooltip" style="left: -999px"></div>`;
  }

  render() {
      const element = document.createElement('div');

      element.innerHTML = this.getTemplate();
  
      this.element = element.firstElementChild;
      document.body.append(this.element);
  }

  initialize() {
      document.addEventListener('pointermove', this.onEnter); 
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.onEnter); 
  }
}

const tooltip = new Tooltip();

export default tooltip; */

