import { dragElement } from "./dragElement";
import { gState } from "./gState";
import { highlight } from "./highlight";
import { ids } from "./ids";

function tryStartDragAndRegistFrom(
  e: MouseEvent,
  targetElement: HTMLElement,
  targetId: string,
  runWaitTimeMs: number
) {
  if (gState.readyRunId) return;

  window.addEventListener("mouseup", endDrag);
  window.addEventListener("keydown", escEndDrag);

  gState.readyRunId = setTimeout(() => {
    gState.readyRunId = undefined;
    gState.enableDelegationClick = false;
    gState.run = true;
    gState.fromOffsetX = e.offsetX;
    gState.fromOffsetY = e.offsetY;

    ids.setFrom(targetId);
    dragElement.appendWithClone(targetElement);
    dragElement.move(e.pageX, e.pageY);
    highlight.addFrom(targetElement);

    window.addEventListener("mousemove", handleDragMouseMove);
  }, runWaitTimeMs);
}

function escEndDrag(e: KeyboardEvent) {
  if (e.key === "Escape") endDrag();
}

function endDrag() {
  clearTimeout(gState.readyRunId);
  clearTimeout(gState.previewId);
  setTimeout(() => (gState.enableDelegationClick = true), 0);

  gState.readyRunId = undefined;
  gState.run = false;

  highlight.resetFrom();
  highlight.resetTo();
  dragElement.reset();

  window.removeEventListener("mousemove", handleDragMouseMove);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("keydown", escEndDrag);

  ids.reset();

  if (gState.dispatchSuccessFlag) gState.previewCancel = null;
  gState.previewCancel?.();
  gState.dispatchSuccessFlag = false;
}

function handleDragMouseMove(e: MouseEvent) {
  dragElement.move(e.pageX, e.pageY);
}

export const ctrl = {
  tryStartDragAndRegistFrom,
  endDrag,
};
