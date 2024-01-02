import { DftCustomEvent, DftSkipCondCallback } from "../public";
import { DftElementCtrl } from "./ElementCtrl";
import { DftHighlight } from "./Highlight";
import { DftIds } from "./Ids";

type OptionalTimeout = NodeJS.Timeout | undefined;
type NullableCallableFunction = CallableFunction | null;

export class DftController {
  #run: boolean;
  #dispatchSuccessFlag: boolean;
  #enableDelegationClick: boolean;
  #readyRunId: OptionalTimeout;

  #ids: DftIds;

  // opt
  #runWaitTimeMs: number;
  #skipCondCallback: DftSkipCondCallback;

  // preview
  #previewId: OptionalTimeout;
  #previewCancel: NullableCallableFunction;

  // Drag Element
  #dragElementCtrl: DftElementCtrl;

  // target elements
  #highlight: DftHighlight;

  // arrow binding
  #onBodyMouseUp = () => this.#endDrag();
  #onBodyMouseMove = (e: MouseEvent) => this.#handleDragMouseMove(e);
  #onBodyKeyDown = (e: KeyboardEvent) => this.#onKeyDown(e);

  constructor(
    container: HTMLElement,
    runWaitTimeMs: number,
    skipCondCallback: DftSkipCondCallback
  ) {
    this.#run = false;
    this.#dispatchSuccessFlag = false;
    this.#enableDelegationClick = true;
    this.#readyRunId = undefined;
    this.#ids = new DftIds();
    this.#runWaitTimeMs = runWaitTimeMs;
    this.#skipCondCallback = skipCondCallback;
    this.#previewId = undefined;
    this.#previewCancel = null;
    this.#dragElementCtrl = new DftElementCtrl(container);
    this.#highlight = new DftHighlight();
  }

  isRun() {
    return this.#run;
  }

  onMouseDown(e: MouseEvent, targetElement: HTMLElement, targetId: string) {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (this.#skipCondCallback(target)) return;

    this.#tryStartDragAndRegistFrom(e, targetElement, targetId);
  }
  onMouseEnter(e: MouseEvent, targetElement: HTMLElement, targetId: string) {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (this.#skipCondCallback(target)) return;

    this.#tryRegistTo(targetElement, targetId);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseLeave(_e: MouseEvent) {
    if (this.#readyRunId) this.#endDrag();
    if (this.#run) {
      clearTimeout(this.#previewId);
      this.#highlight.resetTo();
      this.#ids.getIds();
      if (!this.#previewCancel) this.#ids.resetTo();
    }
  }
  onMouseUp(e: MouseEvent, targetElement: HTMLElement) {
    if (!this.#run) return;
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    const { fromId, toId } = this.#successIds(target, this.#skipCondCallback);
    if (toId === null) return;
    if (fromId === toId) return;

    this.#dispatchSuccessFlag = true;
    targetElement.dispatchEvent(
      new CustomEvent(DftCustomEvent.SUCCESS, {
        detail: { fromId, toId },
        bubbles: true,
      })
    );
  }
  onClick(e: MouseEvent) {
    if (!this.#enableDelegationClick) {
      e.stopPropagation();
    }
  }

  #tryStartDragAndRegistFrom(
    e: MouseEvent,
    targetElement: HTMLElement,
    targetId: string
  ) {
    if (this.#readyRunId) return;

    document.body.addEventListener("mouseup", this.#onBodyMouseUp);
    document.body.addEventListener("keydown", this.#onBodyKeyDown);

    this.#readyRunId = setTimeout(() => {
      this.#readyRunId = undefined;
      this.#enableDelegationClick = false;
      this.#run = true;

      this.#ids.setFrom(targetId);

      this.#dragElementCtrl.set(e.offsetX, e.offsetY);
      this.#dragElementCtrl.move(e.pageX, e.pageY);

      this.#dragElementCtrl.appendWithClone(targetElement);

      this.#highlight.addFrom(targetElement);
      document.body.addEventListener("mousemove", this.#onBodyMouseMove);
    }, this.#runWaitTimeMs);
  }

  #tryRegistTo(targetElement: HTMLElement, toId: string) {
    const { from } = this.#ids.getIds();
    if (from === toId) return;
    if (!this.#run) return;

    this.#ids.setTo(toId);
    this.#highlight.addTo(targetElement);
    clearTimeout(this.#previewId);
    this.#previewId = setTimeout(() => {
      targetElement.dispatchEvent(
        new CustomEvent(DftCustomEvent.PREVIEW, {
          detail: { fromId: from, toId },
          bubbles: true,
        })
      );
      this.#ids.setPreviewTo(toId);

      if (!this.#previewCancel)
        this.#previewCancel = () => {
          targetElement.dispatchEvent(
            new CustomEvent(DftCustomEvent.CANCEL, {
              bubbles: true,
            })
          );
        };
    }, 1200); // Preview 요구사항: 약 2초 -> 1.2초
  }

  #endDrag() {
    clearTimeout(this.#readyRunId);
    clearTimeout(this.#previewId);
    setTimeout(() => (this.#enableDelegationClick = true), 0);

    this.#readyRunId = undefined;
    this.#run = false;

    this.#highlight.resetFrom();
    this.#highlight.resetTo();
    this.#dragElementCtrl.reset();

    document.body.removeEventListener("mousemove", this.#onBodyMouseMove);
    document.body.removeEventListener("mouseup", this.#onBodyMouseUp);
    document.body.removeEventListener("keydown", this.#onBodyKeyDown);

    this.#ids.reset();

    if (this.#dispatchSuccessFlag) this.#previewCancel = null;
    this.#previewCancel?.();
    this.#dispatchSuccessFlag = false;
  }

  #onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") this.#endDrag();
  }

  #handleDragMouseMove(e: MouseEvent) {
    this.#dragElementCtrl.move(e.pageX, e.pageY);
  }

  #successIds(target: HTMLElement, skipCondCallback: DftSkipCondCallback) {
    if (skipCondCallback(target)) {
      // skip 요소 위에서는 Preview 기록 적용
      const { from, previewTo } = this.#ids.getIds();
      return { fromId: from, toId: previewTo };
    } else {
      const { from, to } = this.#ids.getIds();
      return { fromId: from, toId: to };
    }
  }
}
