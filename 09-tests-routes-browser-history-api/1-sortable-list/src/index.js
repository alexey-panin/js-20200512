export default class SortableList {
  element; //html element
  draggable; //html element
  shiftX;
  shiftY;

  onPointerDown = (event) => {
    event.preventDefault();

    const { target, clientX, clientY } = event;
    const { grabHandle } = target.dataset;

    if (grabHandle === undefined) return;
    
    const draggable = target.closest("li");
    
    if (!draggable) return;
    //TODO: if not in use, delete height and width consts
    const { height, width, top, left } = draggable.getBoundingClientRect();

    this.shiftX = clientX - left;
    this.shiftY = clientY - top;

    console.log(this.shiftX);
    console.log(this.shiftY);

    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);

    this.draggable = draggable;

    //From the course book, don't know how much necessary
    this.draggable.ondragstart = function() {
      return false;
    };
  }

  onPointerMove = (event) => {
    const { clientX, clientY } = event;
    const { height, width, top, left } = this.draggable.getBoundingClientRect();

    const shiftX = clientX - left;
    const shiftY = clientY - top;

    const { pageX, pageY } = event;
    
    console.log("page x/y")
    console.log(pageX);
    console.log(pageY);
    console.log("client x/y")
    console.log(clientX);
    console.log(clientY);

    this.draggable.style.left = `${pageX - this.shiftX}px`;
    this.draggable.style.top = `${pageY - this.shiftY}px`;
/*     this.draggable.style.left = pageX + "px";
    this.draggable.style.top = pageY + "px"; */

  }

  onPointerUp = (event) => {
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
  }

  constructor({items}) {
    this.items = items;

    this.render();
  };

  initEventListeners() {
    this.element.addEventListener("pointerdown", this.onPointerDown);

  }

  render() {
    const element = document.createElement('ul');
    element.classList.add("sortable-list");
    element.innerHTML = this.items.join("");

    this.element = element;

    //this.subElements = this.getSubElements();

    this.initEventListeners()
  }

/*   getTableRowTemplate() {
    return this.items
      .map(item => {
        return `
          <span class="sortable-list__item">${item.innerHTML}</span>
        `;
      }).join("");
  } */

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }


}
