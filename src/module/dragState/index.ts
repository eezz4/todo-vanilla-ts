import { InitState } from "./states/InitState";
import { iDragState } from "./states/index";

export type MouseParam =
  | "init_down_ok"
  | "ready_move_try_cancel"
  | "dragging_move"
  | "dragging_end";
type MouseCallback = (param: MouseParam, e: MouseEvent) => boolean;
export type KeyboardParam = "try_cancel";
type KeyboardCallback = (param: KeyboardParam, e: KeyboardEvent) => boolean;
type CancelCallback = () => void;

/**
 * @description
 * - MouseCallback MouseParam
 *   - init_down_ok: boolean
 *   - ready_move_try_cancel: boolean
 *   - dragging_move: void
 *   - dragging_end: void
 *   - cancel: void;
 * - KeyboardCallback KeyboardParam
 *   - try_cancel: boolean
 */
export class Dragger {
  #state: iDragState;

  containerForInit: HTMLElement;
  mouseCb: MouseCallback;
  keyboardCb: KeyboardCallback;
  cancelCb: CancelCallback;

  constructor(
    container: HTMLElement,
    mouseCb: MouseCallback,
    keyboardCb: KeyboardCallback,
    cancelCb: CancelCallback
  ) {
    console.log("Dragger");
    this.containerForInit = container;
    this.mouseCb = mouseCb;
    this.keyboardCb = keyboardCb;
    this.cancelCb = cancelCb;
    this.#state = new InitState(this);
  }
  changeState(next: iDragState) {
    this.#state = next;
  }
  isDragging() {
    return this.#state.getType();
  }
}
