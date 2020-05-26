let activeComponent = null;
let timerId = null;

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
      /**
       * может и не обязательно здесь очищать timeout, работает все также
       * просто заметил, что если очень часто нажимать кнопку, создасться 
       * очень много отложенных колбэков, которые в итоге выполняться.
       */
      if (timerId) clearTimeout(timerId);
    }

    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    activeComponent = this.element;
  }

  show(parent) {

    const placeTimeout = () => {
      timerId = setTimeout( () => this.remove(), this.duration);
    }

    if (parent) {
      parent.append(this.element);
      placeTimeout();
    } else {
      document.body.append(this.element);
      placeTimeout();
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
