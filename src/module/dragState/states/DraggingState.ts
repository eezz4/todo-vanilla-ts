import { Dragger } from "../index";
import { InitState } from "./InitState";
import { StateType, iDragState } from "./index";

export class DraggingState implements iDragState {
  #parent: Dragger;
  constructor(parent: Dragger) {
    this.#parent = parent;

    document.body.addEventListener("mousemove", this.#onMouseMove);
    document.body.addEventListener("mouseup", this.#onMouseUp);
    document.body.addEventListener("keydown", this.#onKeyDown);
    document.body.addEventListener("click", DraggingState.#stopFunc, true);
  }

  #onMouseMove = (e: MouseEvent) => {
    this.#parent.mouseCb("dragging_move", e);
  };
  #onMouseUp = (e: MouseEvent) => {
    this.#end(e);
  };
  #onKeyDown = (e: KeyboardEvent) => {
    const cancel = this.#parent.keyboardCb("try_cancel", e);
    if (cancel) this.#cancel();
  };
  static #stopFunc(e: MouseEvent) {
    e.stopPropagation();
  }

  #end(e: MouseEvent) {
    this.#removeHandlers();
    this.#parent.mouseCb("dragging_end", e);
    this.#parent.changeState(new InitState(this.#parent));
  }
  #cancel() {
    this.#removeHandlers();
    this.#parent.cancelCb();
    this.#parent.changeState(new InitState(this.#parent));
  }
  #removeHandlers() {
    document.body.removeEventListener("mouseup", this.#onMouseUp);
    document.body.removeEventListener("mousemove", this.#onMouseMove);
    document.body.removeEventListener("keydown", this.#onKeyDown);
    setTimeout(() => {
      document.body.removeEventListener("click", DraggingState.#stopFunc, true);
    });
  }

  getType(): StateType {
    return "Drag";
  }
}
