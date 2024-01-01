import { addOnceEventListener } from "../addOnceEventListener";

describe("addOnceEventListener", () => {
  let element: HTMLElement;
  beforeEach(() => {
    element = document.createElement("div");
  });

  test("같은 이름 이벤트 한 번만 등록", () => {
    let count = 0;
    addOnceEventListener(element, "customEvent", () => ++count);
    addOnceEventListener(element, "customEvent", () => ++count);
    addOnceEventListener(element, "customEvent", () => ++count);
    addOnceEventListener(element, "customEvent", () => ++count);

    element.dispatchEvent(new Event("customEvent"));
    element.dispatchEvent(new Event("customEvent"));

    expect(count).toBe(2);
  });

  test("다른 이름 이벤트 동작 테스트", () => {
    let count = 0;
    addOnceEventListener(element, "customEvent1", () => ++count);
    addOnceEventListener(element, "customEvent2", () => ++count);

    element.dispatchEvent(new Event("customEvent1"));
    element.dispatchEvent(new Event("customEvent2"));

    expect(count).toBe(2);
  });
});
