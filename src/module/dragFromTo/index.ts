import { DftSkipCondCallback } from "./public";
import { DftController } from "./units/Controller";

export class DragFromTo {
  #ctrl: DftController;

  constructor(
    container: HTMLElement,
    runWaitTimeMs: number,
    skipCallback: DftSkipCondCallback
  ) {
    this.#ctrl = new DftController(container, runWaitTimeMs, skipCallback);
  }

  applyDragFromTo(targetElement: HTMLElement, targetId: string) {
    // arrow binding 필요

    targetElement.onmousedown = (e) =>
      this.#ctrl.onMouseDown(e, targetElement, targetId);

    targetElement.onmouseenter = (e) =>
      this.#ctrl.onMouseEnter(e, targetElement, targetId);

    targetElement.onmouseup = (e) => this.#ctrl.onMouseUp(e, targetElement);

    targetElement.onmouseleave = (e) => this.#ctrl.onMouseLeave(e);

    targetElement.onclick = (e) => this.#ctrl.onClick(e);
  }

  isRun() {
    return this.#ctrl.isRun();
  }
}
