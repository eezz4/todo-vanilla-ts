const weakMap = new WeakMap<HTMLElement, Set<string>>();

export function addOnceEventListener(
  element: HTMLElement,
  customEvent: string,
  callback: (e: Event) => void
) {
  if (weakMap.get(element)?.has(customEvent)) return;
  const set = weakMap.get(element) ?? new Set<string>();
  set.add(customEvent);
  weakMap.set(element, set);
  element.addEventListener(customEvent, callback);
}
