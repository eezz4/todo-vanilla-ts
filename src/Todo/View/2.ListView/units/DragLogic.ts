import { cloneElementForDrag } from "../../../../module/domUtil/cloneElementForDrag";
import { createElementClassname } from "../../../../module/domUtil/createElementExtend";

export class DraggerLogic {
  #dragElement: HTMLElement;
  #from: HTMLElement | null;
  #to: HTMLElement | null;
  #startPageX: number;
  #startPageY: number;
  #offsetX: number;
  #offsetY: number;
  #previewToId: string | null;
  #previewTimeout: NodeJS.Timeout | undefined;
  #previewRunning: boolean;
  constructor(parent: HTMLElement) {
    this.#dragElement = createElementClassname(parent, "div", "gDragElement");
    this.#dragElement.style.display = "none";
    this.#from = null;
    this.#to = null;
    this.#startPageX = 0;
    this.#startPageY = 0;
    this.#offsetX = 0;
    this.#offsetY = 0;
    this.#previewToId = null;
    this.#previewTimeout = undefined;
    this.#previewRunning = false;
  }
  get from() {
    return this.#from;
  }
  get to() {
    return this.#to;
  }
  setFrom(from: HTMLElement, e: MouseEvent) {
    const rect = from.getBoundingClientRect();
    this.#from = from;
    this.#startPageX = e.pageX;
    this.#startPageY = e.pageY;
    this.#offsetX = e.pageX - rect.left;
    this.#offsetY = e.pageY - rect.top;
  }
  setTo(to: HTMLElement) {
    this.#to = to;
    this.#to.style.borderBottom = "10px solid green";
  }
  start() {
    if (this.#from === null) throw new Error("dev error");
    this.#dragElement.appendChild(cloneElementForDrag(this.#from));
    this.#dragElement.style.display = "";
    this.#dragElement.style.left = this.#startPageX - this.#offsetX + "px";
    this.#dragElement.style.top = this.#startPageY - this.#offsetY + "px";
    this.#from.style.opacity = "0.5";
    this.#from.style.background = "green";
  }
  moveDragElement(e: MouseEvent) {
    this.#dragElement.style.left = e.pageX - this.#offsetX + "px";
    this.#dragElement.style.top = e.pageY - this.#offsetY + "px";
  }

  tryPreview(cbPreview: (fromId: string, previewToId: string) => void) {
    if (this.#to === null) throw new Error("dev error");
    this.#previewToId = this.#to.id;
    if (this.#previewTimeout === undefined)
      this.#previewTimeout = setTimeout(() => {
        if (this.#to) this.#to.style.borderBottom = "";
        this.#previewRunning = true;
        if (this.#from === null) throw new Error("this.#from: null");
        if (this.#previewToId === null)
          throw new Error("this.#previewToId: null");
        cbPreview(this.#from.id, this.#previewToId);
      }, 800);
  }

  clean(cbReset?: () => void) {
    this.#cleanDrag();
    this.#cleanFrom();
    this.cleanTo();
    if (this.#previewRunning) {
      cbReset?.();
    }
    this.#previewRunning = false;
  }

  #cleanDrag() {
    this.#dragElement.innerHTML = "";
    this.#dragElement.style.display = "none";
  }
  #cleanFrom() {
    if (this.#from) {
      this.#from.style.opacity = "";
      this.#from.style.background = "";
    }
    this.#from = null;
  }
  cleanTo() {
    if (this.#to) this.#to.style.borderBottom = "";
    this.#to = null;
    clearTimeout(this.#previewTimeout);
    this.#previewTimeout = undefined;
  }
}
