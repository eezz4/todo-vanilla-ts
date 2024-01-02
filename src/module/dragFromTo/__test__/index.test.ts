import { createElementClassname } from "../../domUtil/createElementExtend";
import { sleep } from "../../promiseUtil/sleep";

import { DragFromTo } from "../index";
import { DftCustomEvent } from "../public";
import { DftElementCtrl } from "../units/ElementCtrl";
import { DftHighlight } from "../units/Highlight";

const RUN_WAIT_TIME = 1;
const neverSkipCond = () => false;
const C = {
  id: {
    1: "id-1",
    2: "id-2",
    3: "id-3",
  },
  classname: {
    1: "classname-1",
    2: "classname-2",
    3: "classname-3",
  },
} as const;

const dispatchBubble = (
  element: HTMLElement,
  type: keyof HTMLElementEventMap
) => element.dispatchEvent(new Event(type, { bubbles: true }));

const dispatchBubbleKeydownEscape = (element: HTMLElement) =>
  element.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    })
  );

describe("dragFromTo 모듈 생성", () => {
  let listViewContainer: HTMLElement;
  beforeEach(() => {
    window.getComputedStyle = jest.fn().mockImplementation(() => []);
    listViewContainer = document.createElement("div");
    document.body.appendChild(listViewContainer);
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test(`DragFromTo 생성 시, .${DftElementCtrl.CLASS_NAME} 요소가 존재해야 한다.`, () => {
    let gDragElement = listViewContainer.querySelector(
      `.${DftElementCtrl.CLASS_NAME}`
    );
    expect(gDragElement).toBeFalsy();

    new DragFromTo(listViewContainer, RUN_WAIT_TIME, neverSkipCond);

    gDragElement = listViewContainer.querySelector(
      `.${DftElementCtrl.CLASS_NAME}`
    );
    expect(gDragElement).toBeTruthy();
  });
});

describe("drag 생명 주기 관련 동작", () => {
  let itemElement1: HTMLElement;
  let dragFromTo: DragFromTo | null = null;

  let listViewContainer: HTMLElement;
  beforeEach(() => {
    window.getComputedStyle = jest.fn().mockImplementation(() => []);
    listViewContainer = document.createElement("div");
    document.body.appendChild(listViewContainer);

    dragFromTo = new DragFromTo(
      listViewContainer,
      RUN_WAIT_TIME,
      neverSkipCond
    );
    itemElement1 = createElementClassname(listViewContainer, "div");
    dragFromTo.applyDragFromTo(itemElement1, "");
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("시작 성공: 조건 및 변경 사항", async () => {
    expect(dragFromTo?.isRun()).toBe(false);

    const gDragElement = document.querySelector(
      `.${DftElementCtrl.CLASS_NAME}`
    );

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 1-1. 미시작
    expect(dragFromTo?.isRun()).toBe(false);

    // 1-2. 미변경 초기 상태
    expect(gDragElement?.firstChild).toBeNull();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeFalsy();

    // 조건: 일정 시간
    await sleep(RUN_WAIT_TIME + 1);

    // 2-1. 시작 성공
    expect(dragFromTo?.isRun()).toBe(true);

    // 2-2. 변경 상태
    expect(gDragElement?.firstChild).toBeTruthy();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeTruthy();
  });

  test("시작 미실행 조건", async () => {
    expect(dragFromTo?.isRun()).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 1. 동일 엘리먼트 mouseleave
    dispatchBubble(itemElement1, "mouseleave");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 2. 동일 엘리먼트 mouseup 버블링
    dispatchBubble(itemElement1, "mouseup");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 4. body mouseup 버블링
    dispatchBubble(document.body, "mouseup");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 4. Escape 키
    dispatchBubbleKeydownEscape(document.body);
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(false);
  });

  test("시작 이후 종료 조건", async () => {
    expect(dragFromTo?.isRun()).toBe(false);

    // 시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // 1. 시작 이후, mouseleave 미종료
    dispatchBubble(itemElement1, "mouseleave");
    expect(dragFromTo?.isRun()).toBe(true);

    // 종료 후 재시작
    dispatchBubble(itemElement1, "mouseup");
    expect(dragFromTo?.isRun()).toBe(false);
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // 2. 동일 element mouse up 종료
    dispatchBubble(itemElement1, "mouseup");
    expect(dragFromTo?.isRun()).toBe(false);

    // 재시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // 3. body mouse up 종료
    dispatchBubble(document.body, "mouseup");
    expect(dragFromTo?.isRun()).toBe(false);

    // 재시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // 4. esc 종료
    dispatchBubbleKeydownEscape(document.body);
    expect(dragFromTo?.isRun()).toBe(false);
  });

  test("click delegation 컨트롤", async () => {
    await sleep(0);

    function checkBodyClickDelegation() {
      return new Promise((res) => {
        const timeout = setTimeout(() => res(false), 1);
        document.body.addEventListener("click", () => {
          clearTimeout(timeout);
          res(true);
        });

        dispatchBubble(itemElement1, "click");
      });
    }

    // 1. 실행 중이 아닐 때는 click을 받을 수 있다.
    expect(dragFromTo?.isRun()).toBe(false);
    let delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(true);

    // 시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // 2. 실행 중일 때는 click을 받지 못한다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(false);

    // 종료
    dispatchBubble(itemElement1, "mouseup");
    expect(dragFromTo?.isRun()).toBe(false);

    // 3. mouseup과 이어지는 동기적 click은 무시된다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(false);

    // 4. 이후 비동기적 클릭은 받을 수 있다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(true);
  });
});

describe("to타겟 선정 및 delegation CustomEvent", () => {
  let itemElement1: HTMLElement;
  let itemElement2: HTMLElement;
  let itemElement3: HTMLElement;
  let dragFromTo: DragFromTo | null = null;

  let listViewContainer: HTMLElement;
  beforeEach(() => {
    window.getComputedStyle = jest.fn().mockImplementation(() => []);
    listViewContainer = document.createElement("div");
    document.body.appendChild(listViewContainer);
    dragFromTo = new DragFromTo(
      listViewContainer,
      RUN_WAIT_TIME,
      neverSkipCond
    );

    itemElement1 = createElementClassname(
      listViewContainer,
      "div",
      C.classname[1]
    );
    dragFromTo.applyDragFromTo(itemElement1, C.id[1]);
    itemElement2 = createElementClassname(
      listViewContainer,
      "div",
      C.classname[2]
    );
    dragFromTo.applyDragFromTo(itemElement2, C.id[2]);
    itemElement3 = createElementClassname(
      listViewContainer,
      "div",
      C.classname[3]
    );
    dragFromTo.applyDragFromTo(itemElement3, C.id[3]);
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("to타겟 선정", async () => {
    // 초기 상태
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeFalsy();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement2.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement3.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();

    // 시작한다.
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // 1. 상태 변경 확인
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeTruthy();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement2.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeTruthy();
    expect(
      itemElement3.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();

    // itemElement2 -> itemElement3 이동한다.
    dispatchBubble(itemElement2, "mouseleave");
    dispatchBubble(itemElement3, "mouseenter");

    // 2. 상태 변경 확인
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeTruthy();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement2.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement3.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeTruthy();

    // itemElement3 -> itemElement1 이동한다.
    dispatchBubble(itemElement3, "mouseleave");
    dispatchBubble(itemElement1, "mouseenter");

    // 3. 상태 변경 확인
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.from}`)
    ).toBeTruthy();
    expect(
      itemElement1.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement2.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
    expect(
      itemElement3.classList.contains(`${DftHighlight.CLASS_NAME.to}`)
    ).toBeFalsy();
  });

  test("delegation CustomEvent", async () => {
    const PREVIEW_TIME = 1200;
    let actualCustomEvnet = "";
    let actualDetail = null;
    listViewContainer.addEventListener(DftCustomEvent.SUCCESS, (e) => {
      actualCustomEvnet = DftCustomEvent.SUCCESS;
      actualDetail = (e as CustomEvent).detail;
    });
    listViewContainer.addEventListener(DftCustomEvent.PREVIEW, (e) => {
      actualCustomEvnet = DftCustomEvent.PREVIEW;
      actualDetail = (e as CustomEvent).detail;
    });
    listViewContainer.addEventListener(DftCustomEvent.CANCEL, (e) => {
      actualCustomEvnet = DftCustomEvent.CANCEL;
      actualDetail = (e as CustomEvent).detail;
    });

    // itemElement1 시작한다.
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);

    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // 1. 변경 없음
    expect(actualCustomEvnet).toBe("");
    expect(actualDetail).toEqual(null);

    // PREVIEW_TIME 이후
    await sleep(PREVIEW_TIME);

    // 2. previwe 받음
    expect(actualCustomEvnet).toBe(DftCustomEvent.PREVIEW);
    expect(actualDetail).toEqual({ fromId: C.id[1], toId: C.id[2] });

    // mouse up
    dispatchBubble(itemElement2, "mouseup");

    // 3. success 받음
    expect(actualCustomEvnet).toBe(DftCustomEvent.SUCCESS);
    expect(actualDetail).toEqual({ fromId: C.id[1], toId: C.id[2] });

    // itemElement1 재시작한다.
    expect(dragFromTo?.isRun()).toBe(false);
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);
    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // PREVIEW_TIME 이후, ESC 입력
    await sleep(PREVIEW_TIME);
    dispatchBubbleKeydownEscape(document.body);

    // 4. cancel 받음
    expect(actualCustomEvnet).toBe(DftCustomEvent.CANCEL);
    expect(actualDetail).toEqual(null);

    // itemElement3 재시작한다.
    expect(dragFromTo?.isRun()).toBe(false);
    dispatchBubble(itemElement3, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(dragFromTo?.isRun()).toBe(true);
    // itemElement3 -> itemElement1 이동한다.
    dispatchBubble(itemElement3, "mouseleave");
    dispatchBubble(itemElement1, "mouseenter");
    // mouseup한다.
    dispatchBubble(itemElement1, "mouseup");

    // 5. success 받음
    expect(actualCustomEvnet).toBe(DftCustomEvent.SUCCESS);
    expect(actualDetail).toEqual({ fromId: C.id[3], toId: C.id[1] });
  });
});
