let activeComponent = null;

export default class NotificationMessage {
  element; // HTMLElement;

  constructor(
    message, 
    {
      duration,
      type
    } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    
    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
              ${this.message}
            </div>
        </div>
      </div>
    `;
  }

  render() {

    if (activeComponent) {
      activeComponent.remove();
    }

    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    activeComponent = this.element;
  }

  show(parent = document.body) {
    parent.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

