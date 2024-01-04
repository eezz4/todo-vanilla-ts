import { InitState } from "./states/InitState";
import { iDragState } from "./states/index";

export type MouseParam =
  | "init_down_try"
  | "ready_move_try_cancel"
  | "ready_start_dragging"
  | "dragging_move"
  | "dragging_end";
type MouseCallback = (param: MouseParam, e?: MouseEvent) => boolean | void;
export type KeyboardParam = "try_cancel";
type KeyboardCallback = (param: KeyboardParam, e: KeyboardEvent) => boolean;
type CancelCallback = () => void;

/**
 * @description
 *  - MouseCallback MouseParam
 *    - init_down_try: boolean
 *    - ready_move_try_cancel: boolean
 *    - ready_start_dragging: void
 *    - dragging_move: void
 *    - dragging_end: void
 *  - KeyboardCallback KeyboardParam
 *    - try_cancel: boolean
 *  - CancelCallback
 */
export class Dragger {
  #state: iDragState;

  containerForInit: HTMLElement;
  readyTime: number;
  mouseCb: MouseCallback;
  keyboardCb: KeyboardCallback;
  cancelCb: CancelCallback;

  constructor(
    container: HTMLElement,
    readyTime: number,
    mouseCb: MouseCallback,
    keyboardCb: KeyboardCallback,
    cancelCb: CancelCallback
  ) {
    this.containerForInit = container;
    this.readyTime = readyTime;
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
