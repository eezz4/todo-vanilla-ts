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

  gState.readyRunId = setTimeout(() => {
    gState.readyRunId = undefined;
    gState.delegationClick = false;
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

function endDrag() {
  if (gState.readyRunId) clearTimeout(gState.readyRunId);
  if (gState.run) setTimeout(() => (gState.delegationClick = true), 100);
  gState.readyRunId = undefined;
  gState.run = false;

  highlight.resetFrom();
  highlight.resetTo();
  dragElement.reset();
  window.removeEventListener("mousemove", handleDragMouseMove);
  window.removeEventListener("mouseup", endDrag);

  gState.previewCancel?.();
}

function handleDragMouseMove(e: MouseEvent) {
  dragElement.move(e.pageX, e.pageY);
}

export const ctrl = {
  tryStartDragAndRegistFrom,
  endDrag,
};
