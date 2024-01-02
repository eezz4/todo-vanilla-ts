type NullableHTMLElment = HTMLElement | null;

export class DftHighlight {
  static CLASS_NAME = {
    from: "dragFrom",
    to: "dragTo",
  } as const;

  #from: NullableHTMLElment;
  #to: NullableHTMLElment;

  constructor() {
    this.#from = null;
    this.#to = null;
  }
  addFrom(fromElement: HTMLElement) {
    this.#from = fromElement;
    this.#from?.classList.add(DftHighlight.CLASS_NAME.from);
  }
  resetFrom() {
    this.#from?.classList.remove(DftHighlight.CLASS_NAME.from);
    this.#from = null;
  }
  addTo(toElement: HTMLElement) {
    this.#to = toElement;
    this.#to?.classList.add(DftHighlight.CLASS_NAME.to);
  }
  resetTo() {
    this.#to?.classList.remove(DftHighlight.CLASS_NAME.to);
    this.#to = null;
  }
}
