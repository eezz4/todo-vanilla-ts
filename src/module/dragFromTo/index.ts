import { DRAG_CUSTOM_EVENT } from "./DRAG_CUSTOM_EVENT";
import { ctrl } from "./units/controller";
import { gState } from "./units/gState";
import { highlight } from "./units/highlight";
import { ids } from "./units/ids";

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

  targetElement.onmouseup = (e) => {
    if (!gState.run) return;
    if (e.target === null) return;
    const target = e.target as HTMLElement;

    if (skipCallback(target)) {
      // skip 요소 위에서는 Preview 기록 적용
      const { from, previewTo } = ids.getIds();
      if (previewTo === null) return;
      if (from === previewTo) return;
      targetElement.dispatchEvent(
        new CustomEvent(DRAG_CUSTOM_EVENT.SUCCESS, {
          detail: { fromId: from, toId: previewTo },
          bubbles: true,
        })
      );
    } else {
      const { from, to } = ids.getIds();
      if (to === null) return;
      if (from === to) return;
      targetElement.dispatchEvent(
        new CustomEvent(DRAG_CUSTOM_EVENT.SUCCESS, {
          detail: { fromId: from, toId: to },
          bubbles: true,
        })
      );
    }
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
    ids.setPreviewTo(toId);

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
