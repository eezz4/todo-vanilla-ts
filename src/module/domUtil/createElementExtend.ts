export function createElementClassname<
  CHILD_TAG_KEY extends keyof HTMLElementTagNameMap
>(parent: HTMLElement, childTagName: CHILD_TAG_KEY, classname?: string) {
  const element = document.createElement(childTagName);
  if (classname) element.className = classname;

  parent.appendChild(element);
  return element;
}
