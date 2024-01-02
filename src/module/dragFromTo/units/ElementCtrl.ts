import { createElementClassname } from "../../domUtil/createElementExtend";

export class DftElementCtrl {
  static CLASS_NAME = "gDragElement";

  #element: HTMLElement;
  #fromOffsetX: number;
  #fromOffsetY: number;

  constructor(container: HTMLElement) {
    this.#element = createElementClassname(
      container,
      "div",
      DftElementCtrl.CLASS_NAME
    ); // 클래스명
    this.#element.style.pointerEvents = "none";
    this.#fromOffsetX = 0;
    this.#fromOffsetY = 0;
  }

  set(fromOffsetX: number, fromOffsetY: number) {
    this.#fromOffsetX = fromOffsetX;
    this.#fromOffsetY = fromOffsetY;
  }
  reset() {
    this.#element.innerHTML = "";
  }
  appendWithClone(elementAtDown: HTMLElement) {
    const cloneAtDown = elementAtDown.cloneNode(true) as HTMLElement;
    this.#element.appendChild(cloneAtDown);
    DftElementCtrl.#cloneStyleAndPointerEventNone(cloneAtDown, elementAtDown);
  }
  static #cloneStyleAndPointerEventNone(
    parentElement: HTMLElement,
    childElement: HTMLElement
  ) {
    const childStyle = window.getComputedStyle(childElement);
    for (const key of childStyle) {
      parentElement.style.setProperty(key, childStyle.getPropertyValue(key));
    }
    parentElement.style.pointerEvents = "none";

    // Array.from(parentElement.children).forEach((parent, index) => {
    //   if (parent.nodeType === Node.ELEMENT_NODE) {
    //     DftElementCtrl.#recursiveApplyStyle(
    //       parent as HTMLElement,
    //       childElement.children[index] as HTMLElement
    //     );
    //   }
    // });
  }
  move(pageX: number, pageY: number) {
    this.#element.style.left = pageX - this.#fromOffsetX + "px";
    this.#element.style.top = pageY - this.#fromOffsetY + "px";
  }
}
