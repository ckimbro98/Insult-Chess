class Label {
  constructor(text, type) {
    this.element = document.createElement("div");
    this.element.classList.add(`label-${type}`);
    this.element.textContent = text;
  }
}