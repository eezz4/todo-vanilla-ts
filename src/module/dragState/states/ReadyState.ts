import { Dragger } from "../index";
import { DraggingState } from "./DraggingState";
import { InitState } from "./InitState";
import { StateType, iDragState } from "./index";

export class ReadyState implements iDragState {
  #parent: Dragger;
  #timeout: NodeJS.Timeout;

  constructor(parent: Dragger) {
    this.#parent = parent;

    document.body.addEventListener("mouseup", this.#onMouseUp);
    document.body.addEventListener("mousemove", this.#onMouseMove);
    document.body.addEventListener("keydown", this.#onKeyDown);
    this.#timeout = setTimeout(() => {
      this.#start();
    }, this.#parent.readyTime);
  }

  #onMouseMove = (e: MouseEvent) => {
    const cancel = this.#parent.mouseCb("ready_move_try_cancel", e);
    if (cancel) this.#cancel();
  };
  #onMouseUp = () => {
    this.#cancel();
  };
  #onKeyDown = (e: KeyboardEvent) => {
    const cancel = this.#parent.keyboardCb("try_cancel", e);
    if (cancel) this.#cancel();
  };

  #start() {
    this.#parent.mouseCb("ready_start_dragging");
    this.#removeHandlers();
    this.#parent.changeState(new DraggingState(this.#parent));
  }
  #cancel() {
    clearTimeout(this.#timeout);
    this.#removeHandlers();
    this.#parent.cancelCb();
    this.#parent.changeState(new InitState(this.#parent));
  }
  #removeHandlers() {
    document.body.removeEventListener("mouseup", this.#onMouseUp);
    document.body.removeEventListener("mousemove", this.#onMouseMove);
    document.body.removeEventListener("keydown", this.#onKeyDown);
  }

  getType(): StateType {
    return "Ready";
  }
}
