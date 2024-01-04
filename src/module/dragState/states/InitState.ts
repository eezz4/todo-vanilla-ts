import { Dragger } from "../index";
import { ReadyState } from "./ReadyState";
import { StateType, iDragState } from "./index";

export class InitState implements iDragState {
  #parent: Dragger;

  constructor(parent: Dragger) {
    this.#parent = parent;

    this.#parent.containerForInit.addEventListener(
      "mousedown",
      this.#onMouseDown
    );
  }

  #onMouseDown = (e: MouseEvent) => {
    const ok = this.#parent.mouseCb("init_down_try", e);
    if (ok) {
      this.#parent.containerForInit.removeEventListener(
        "mousedown",
        this.#onMouseDown
      );
      this.#parent.changeState(new ReadyState(this.#parent));
    }
  };

  getType(): StateType {
    return "Init";
  }
}
