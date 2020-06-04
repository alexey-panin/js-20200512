class Tooltip {
  element = null;
  elementWithTooltip = null;

  elementOnPointerOverShowTooltip = (event) => {
    console.log("element pointer over");

/*     const target = event.target;
    const tooltipHtml = target.dataset.tooltip;

    //if (this.elementWithTooltip === target) return;

    this.render(tooltipHtml, event.clientX, event.clientY);

    this.elementWithTooltip = target; */

  }

  elementOnPointerOutRemoveTooltip = (event) => {
    console.log("element pointer out");
    console.log(event.target);
    console.log(event.relatedTarget);
    if (this.element) {
      this.remove();
      this.element = null;
      this.elementWithTooltip = null;
    }

  }

  elementOnPointerMoveShowTooltip = (event) => {

/*     let relatedTarget = event.relatedTarget;

    console.log(event.relatedTarget);

    while (relatedTarget) {
      // поднимаемся по дереву элементов и проверяем – внутри ли мы currentElem или нет
      // если да, то это переход внутри элемента – игнорируем
      if (relatedTarget == currentElem) return;
  
      relatedTarget = relatedTarget.parentNode;
    } */

    console.log("element pointer move");

    this.element.style.cssText = `left: ${event.clientX + 10}px; top: ${event.clientY + 10}px;`
  }

  remove = () => {
    //this.removeEventListeners();
    console.log("removed");
    this.element.remove();
  }

  documentOnPointerOverShowTooltip = (event) => {
    const target = event.target;

    if (target.dataset.tooltip) {

      // create only initial tooltip element by global event handler
      // other creates within divs will be handled by element handlers
      if (!this.element) {
        const tooltipHtml = target.dataset.tooltip;
        this.render(tooltipHtml, event.clientX, event.clientY);   
        this.elementWithTooltip = target;
      }

      target.addEventListener("pointerover", this.elementOnPointerOverShowTooltip);
      target.addEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
      target.addEventListener("pointerout", this.elementOnPointerOutRemoveTooltip);

 /*      this.elementWithTooltip = target; */

      console.log("global document pointer over");
    }

    //console.log(event.target);
    //event.target.addEventListener("pointerover", this.elementOnPointerOverShowTooltip);
    //event.target.addEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
    //event.target.removeEventListener("pointerout", this.elementOnPointerOverShowTooltip);
    //event.target.addEventListener("pointerout", this.remove);
  }

  documentOnPointerOutRemoveTooltip = (event) => {
    // элемент с которого ушел курсор
    const target = event.target;
    // элемент на который ушел курсор
    const elementLeaveTo = event.relatedTarget;

    // если курсор ушел на другой элемент с тултипом, удалять тултип глобальным обработчиком не надо
    //if (elementLeaveTo !== null && elementLeaveTo.dataset.tooltip) return;

    console.log("global pointer out");
    // иначе удаляем элемент если он есть
    if (this.element) {
      this.remove();
      this.element = null;
      this.elementWithTooltip = null;
    }

    // TODO cursor went away from all divs how to delete all the event listeners

    // и удаляем ранее навешанные обработчики событий с элемента с которого ушли
    target.removeEventListener("pointerover", this.elementOnPointerOverShowTooltip);
    target.removeEventListener("pointermove", this.elementOnPointerMoveShowTooltip);
    target.removeEventListener("pointerout", this.elementOnPointerOutRemoveTooltip);
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

