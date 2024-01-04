export function cloneElementForDrag(origin: HTMLElement) {
  const cloned = origin.cloneNode(true) as HTMLElement;
  cloneStyleAndPointerEventNone(cloned, origin);
  return cloned;
}

function cloneStyleAndPointerEventNone(
  parentElement: HTMLElement,
  childElement: HTMLElement
) {
  const childStyle = window.getComputedStyle(childElement);
  for (const key of childStyle) {
    parentElement.style.setProperty(key, childStyle.getPropertyValue(key));
  }
  parentElement.style.pointerEvents = "none";

  Array.from(parentElement.children).forEach((parent, index) => {
    if (parent.nodeType === Node.ELEMENT_NODE) {
      cloneStyleAndPointerEventNone(
        parent as HTMLElement,
        childElement.children[index] as HTMLElement
      );
    }
  });
}