import { createElementClassname } from "../../domUtil/createElementExtend";
import { DRAG_CUSTOM_EVENT } from "../DRAG_CUSTOM_EVENT";
import { applyDragFromTo } from "../index";
import { gState } from "../units/gState";

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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

describe("dragFromTo 모듈 import", () => {
  test("모듈 import 시, classname gDragElement 요소가 존재해야 한다.", () => {
    const gDragElement = document.querySelector(".gDragElement");
    expect(gDragElement).toBeTruthy();
  });
});

describe("drag 생명 주기 관련 동작", () => {
  let itemElement1: HTMLElement;

  beforeEach(() => {
    itemElement1 = createElementClassname(document.body, "div");
    applyDragFromTo(itemElement1, "", neverSkipCond, RUN_WAIT_TIME);

    dispatchBubble(document.body, "mouseup"); // 종료: 글로벌 변수 초기화
  });

  test("시작 성공: 조건 및 변경 사항", async () => {
    expect(gState.run).toBe(false);
    const gDragElement = document.querySelector(".gDragElement");

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 1-1. 미시작
    expect(gState.run).toBe(false);
    // 1-2. 미변경 초기 상태
    expect(itemElement1.classList.contains("dragFrom")).toBeFalsy();
    expect(gDragElement?.firstChild).toBeNull();

    // 조건: 일정 시간
    await sleep(RUN_WAIT_TIME + 1);

    // 2-1. 시작 성공
    expect(gState.run).toBe(true);
    // 2-2. 변경 상태
    expect(itemElement1.classList.contains("dragFrom")).toBeTruthy();
    expect(gDragElement?.firstChild).toBeTruthy();
  });

  test("시작 미실행 조건", async () => {
    expect(gState.run).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 1. 동일 엘리먼트 mouseleave
    dispatchBubble(itemElement1, "mouseleave");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 2. 동일 엘리먼트 mouseup 버블링
    dispatchBubble(itemElement1, "mouseup");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 4. body mouseup 버블링
    dispatchBubble(document.body, "mouseup");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(false);

    // 시작 시도
    dispatchBubble(itemElement1, "mousedown");

    // 4. Escape 키
    dispatchBubbleKeydownEscape(document.body);
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(false);
  });

  test("시작 이후 종료 조건", async () => {
    expect(gState.run).toBe(false);

    // 시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // 1. 시작 이후, mouseleave 미종료
    dispatchBubble(itemElement1, "mouseleave");
    expect(gState.run).toBe(true);

    // 종료 후 재시작
    dispatchBubble(itemElement1, "mouseup");
    expect(gState.run).toBe(false);
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // 2. 동일 element mouse up 종료
    dispatchBubble(itemElement1, "mouseup");
    expect(gState.run).toBe(false);

    // 재시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // 3. body mouse up 종료
    dispatchBubble(document.body, "mouseup");
    expect(gState.run).toBe(false);

    // 재시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // 4. esc 종료
    dispatchBubbleKeydownEscape(document.body);
    expect(gState.run).toBe(false);
  });

  test("click delegation 컨트롤", async () => {
    // delegationClick 컨트롤 테스트 global 제약 사항
    // 드래그 종료 후, delegationClick 초기화 타이밍이 존재함.
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
    expect(gState.run).toBe(false);
    let delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(true);

    // 시작
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // 2. 실행 중일 때는 click을 받지 못한다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(false);

    // 종료
    dispatchBubble(itemElement1, "mouseup");
    expect(gState.run).toBe(false);

    // 3. mouseup과 이어지는 동기적 click은 무시된다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(false);

    // 4. 이후 비동기적 클릭은 받을 수 있다.
    delegetion = await checkBodyClickDelegation();
    expect(delegetion).toBe(true);
  });
});

describe("to타겟 선정 및 delegation DRAG_CUSTOM_EVENT", () => {
  let itemElement1: HTMLElement;
  let itemElement2: HTMLElement;
  let itemElement3: HTMLElement;

  beforeEach(() => {
    itemElement1 = createElementClassname(document.body, "div", C.classname[1]);
    applyDragFromTo(itemElement1, C.id[1], neverSkipCond, RUN_WAIT_TIME);
    itemElement2 = createElementClassname(document.body, "div", C.classname[2]);
    applyDragFromTo(itemElement2, C.id[2], neverSkipCond, RUN_WAIT_TIME);
    itemElement3 = createElementClassname(document.body, "div", C.classname[3]);
    applyDragFromTo(itemElement3, C.id[3], neverSkipCond, RUN_WAIT_TIME);

    dispatchBubble(document.body, "mouseup"); // 종료: 글로벌 변수 초기화
  });

  test("to타겟 선정", async () => {
    // 초기 상태
    expect(itemElement1.classList.contains("dragFrom")).toBeFalsy();
    expect(itemElement1.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement2.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement3.classList.contains("dragTo")).toBeFalsy();

    // 시작한다.
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // 1. 상태 변경 확인
    expect(itemElement1.classList.contains("dragFrom")).toBeTruthy();
    expect(itemElement1.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement2.classList.contains("dragTo")).toBeTruthy();
    expect(itemElement3.classList.contains("dragTo")).toBeFalsy();

    // itemElement2 -> itemElement3 이동한다.
    dispatchBubble(itemElement2, "mouseleave");
    dispatchBubble(itemElement3, "mouseenter");

    // 2. 상태 변경 확인
    expect(itemElement1.classList.contains("dragFrom")).toBeTruthy();
    expect(itemElement1.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement2.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement3.classList.contains("dragTo")).toBeTruthy();

    // itemElement3 -> itemElement1 이동한다.
    dispatchBubble(itemElement3, "mouseleave");
    dispatchBubble(itemElement1, "mouseenter");

    // 3. 상태 변경 확인
    expect(itemElement1.classList.contains("dragFrom")).toBeTruthy();
    expect(itemElement1.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement2.classList.contains("dragTo")).toBeFalsy();
    expect(itemElement3.classList.contains("dragTo")).toBeFalsy();
  });

  test("delegation DRAG_CUSTOM_EVENT", async () => {
    const PREVIEW_TIME = 1200;
    let actualCustomEvnet = "";
    let actualDetail = null;
    document.body.addEventListener(DRAG_CUSTOM_EVENT.SUCCESS, (e) => {
      actualCustomEvnet = DRAG_CUSTOM_EVENT.SUCCESS;
      actualDetail = (e as CustomEvent).detail;
    });
    document.body.addEventListener(DRAG_CUSTOM_EVENT.PREVIEW, (e) => {
      actualCustomEvnet = DRAG_CUSTOM_EVENT.PREVIEW;
      actualDetail = (e as CustomEvent).detail;
    });
    document.body.addEventListener(DRAG_CUSTOM_EVENT.CANCEL, (e) => {
      actualCustomEvnet = DRAG_CUSTOM_EVENT.CANCEL;
      actualDetail = (e as CustomEvent).detail;
    });

    // itemElement1 시작한다.
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);

    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // 1. 변경 없음
    expect(actualCustomEvnet).toBe("");
    expect(actualDetail).toEqual(null);

    // PREVIEW_TIME 이후
    await sleep(PREVIEW_TIME);

    // 2. previwe 받음
    expect(actualCustomEvnet).toBe(DRAG_CUSTOM_EVENT.PREVIEW);
    expect(actualDetail).toEqual({ fromId: C.id[1], toId: C.id[2] });

    // mouse up
    dispatchBubble(itemElement2, "mouseup");

    // 3. success 받음
    expect(actualCustomEvnet).toBe(DRAG_CUSTOM_EVENT.SUCCESS);
    expect(actualDetail).toEqual({ fromId: C.id[1], toId: C.id[2] });

    // itemElement1 재시작한다.
    expect(gState.run).toBe(false);
    dispatchBubble(itemElement1, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);
    // itemElement1 -> itemElement2 이동한다.
    dispatchBubble(itemElement1, "mouseleave");
    dispatchBubble(itemElement2, "mouseenter");

    // PREVIEW_TIME 이후, ESC 입력
    await sleep(PREVIEW_TIME);
    dispatchBubbleKeydownEscape(document.body);

    // 4. cancel 받음
    expect(actualCustomEvnet).toBe(DRAG_CUSTOM_EVENT.CANCEL);
    expect(actualDetail).toEqual(null);

    // itemElement3 재시작한다.
    expect(gState.run).toBe(false);
    dispatchBubble(itemElement3, "mousedown");
    await sleep(RUN_WAIT_TIME + 1);
    expect(gState.run).toBe(true);
    // itemElement3 -> itemElement1 이동한다.
    dispatchBubble(itemElement3, "mouseleave");
    dispatchBubble(itemElement1, "mouseenter");
    // mouseup한다.
    dispatchBubble(itemElement1, "mouseup");

    // 5. success 받음
    expect(actualCustomEvnet).toBe(DRAG_CUSTOM_EVENT.SUCCESS);
    expect(actualDetail).toEqual({ fromId: C.id[3], toId: C.id[1] });
  });
});
