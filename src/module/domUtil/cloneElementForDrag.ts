export function cloneElementForDrag(origin: HTMLElement) {
  const cloned = origin.cloneNode(true) as HTMLElement;
  cloneStyleAndPointerEventNone(cloned, origin);
  return cloned;
}
function cloneStyleAndPointerEventNone(
  parentElement: HTMLElement,
  childElement: Element
) {
  const childStyle = window.getComputedStyle(childElement);
  for (const key of childStyle) {
    parentElement.style.setProperty(key, childStyle.getPropertyValue(key));
  }
  parentElement.style.pointerEvents = "none";

  Array.from(parentElement.children).forEach((parent, index) => {
    const child = childElement.children[index];
    if (parent instanceof HTMLElement) {
      cloneStyleAndPointerEventNone(parent, child);
    }
  });
}
