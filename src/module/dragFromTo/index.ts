import { ctrl } from "./units/controller";
import { ids } from "./units/ids";

import { DRAG_CUSTOM_EVENT } from "./DRAG_CUSTOM_EVENT";
import { gState } from "./units/gState";
import { highlight } from "./units/highlight";

interface SkipCondCallback {
  (element: HTMLElement): boolean;
}
/**
 * 글로벌 변수 사용. 다중 사용 시, prefix 및 확장 필요
 */
export function applyDragFromTo(
  targetElement: HTMLElement,
  id: string,
  skipCallback: SkipCondCallback,
  runWaitTimeMs: number
) {
  targetElement.onmousedown = (e) => {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (skipCallback(target)) return;

    ctrl.tryStartDragAndRegistFrom(e, targetElement, id, runWaitTimeMs);
  };

  targetElement.onmouseenter = (e) => {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (skipCallback(target)) return;

    tryRegistTo(targetElement, id);
  };

  targetElement.onmouseleave = () => handleLeave();

  targetElement.onmouseup = () => {
    if (!gState.run) return;
    const { from, to } = ids.getIds();
    if (to === null) return;
    if (from === to) return;
    // completed 요소도 성공 포함

    targetElement.dispatchEvent(
      new CustomEvent(DRAG_CUSTOM_EVENT.SUCCESS, {
        detail: { fromId: from, toId: to },
        bubbles: true,
      })
    );
    ids.reset();
    gState.previewCancel = undefined;
  };

  targetElement.onclick = handleClickDelegationCtrl;
}

function tryRegistTo(targetElement: HTMLElement, toId: string) {
  const { from } = ids.getIds();
  if (from === toId) return;
  if (!gState.run) return;

  ids.setTo(toId);
  highlight.addTo(targetElement);
  clearTimeout(gState.previewId);
  gState.previewId = setTimeout(() => {
    targetElement.dispatchEvent(
      new CustomEvent(DRAG_CUSTOM_EVENT.PREVIEW, {
        detail: { fromId: from, toId },
        bubbles: true,
      })
    );
    if (!gState.previewCancel)
      gState.previewCancel = () => {
        targetElement.dispatchEvent(
          new CustomEvent(DRAG_CUSTOM_EVENT.CANCEL, {
            bubbles: true,
          })
        );
      };
  }, 1200); // 요구사항: 약 2초 -> 1.2초
}

function handleLeave() {
  if (gState.readyRunId) ctrl.endDrag();
  if (gState.run) {
    clearTimeout(gState.previewId);
    highlight.resetTo();
    ids.getIds();
    if (!gState.previewCancel) ids.resetTo();
  }
}

function handleClickDelegationCtrl(e: MouseEvent) {
  if (!gState.delegationClick) {
    e.stopPropagation();
    gState.delegationClick = true;
  }
}
