const CLASS_NAME = {
  from: "dragFrom",
  to: "dragTo",
};

const element = {
  from: null as HTMLElement | null,
  to: null as HTMLElement | null,
};

function addFrom(fromElement: HTMLElement) {
  element.from = fromElement;
  element.from?.classList.add(CLASS_NAME.from);
}
function resetFrom() {
  element.from?.classList.remove(CLASS_NAME.from);
  element.from = null;
}
function addTo(toElement: HTMLElement) {
  element.to = toElement;
  element.to?.classList.add(CLASS_NAME.to);
}
function resetTo() {
  element.to?.classList.remove(CLASS_NAME.to);
  element.to = null;
}

export const highlight = {
  addFrom,
  addTo,
  resetFrom,
  resetTo,
};
