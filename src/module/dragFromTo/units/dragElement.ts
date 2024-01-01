import { createElementClassname } from "../../domUtil/createElementExtend";
import { gState } from "./gState";

const gDragElement = createElementClassname(
  document.body,
  "div",
  "gDragElement"
);

function reset() {
  gDragElement.innerHTML = "";
}

function appendWithClone(elementAtDown: HTMLElement) {
  const cloneAtDown = elementAtDown.cloneNode(true) as HTMLElement;
  gDragElement.appendChild(cloneAtDown);
  const todoRect = elementAtDown.getBoundingClientRect();
  cloneAtDown.style.width = todoRect.width + "px";
  cloneAtDown.style.height = todoRect.height + "px";
}

function move(pageX: number, pageY: number) {
  gDragElement.style.left = pageX - gState.fromOffsetX + "px";
  gDragElement.style.top = pageY - gState.fromOffsetY + "px";
}

export const dragElement = {
  reset,
  appendWithClone,
  move,
};
