import { createElementClassname } from "../createElementExtend";

describe("createElementExtend", () => {
  let parent: HTMLElement;

  beforeEach(() => {
    parent = document.createElement("div");
  });

  test("자식 엘리먼트 생성 확인", () => {
    const child1 = createElementClassname(parent, "span");
    expect(parent.firstChild).toBe(child1);
    expect(child1 instanceof HTMLSpanElement).toBeTruthy();

    const child2 = createElementClassname(parent, "div");
    expect(parent.lastChild).toBe(child2);
    expect(child2 instanceof HTMLDivElement).toBeTruthy();
  });

  test("생성된 자식 엘리먼트 className 확인", () => {
    const child1 = createElementClassname(parent, "div");
    expect(child1.className).toBe("");

    const child2 = createElementClassname(parent, "div", "test-classname");
    expect(child2.className).toBe("test-classname");
  });
});
