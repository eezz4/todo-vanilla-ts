import { createTodoStore } from "../createTodoStore";

type TodoStore = ReturnType<typeof createTodoStore>;
function getContents(store: TodoStore) {
  return store.state.items.map((v) => ({
    id: v.id,
    text: v.text,
    completed: v.completed,
  }));
}

describe("createTodoStore", () => {
  let store: TodoStore;
  beforeEach(() => {
    store = createTodoStore();
  });

  test("dispatch에 따른 render function 호출 확인", () => {
    let renderFlag = false;
    function renderFunction() {
      renderFlag = true;
    }
    store.subscribe(renderFunction);
    store.dispatch({ type: "TodoActionFilter", payload: { filter: "all" } });

    expect(renderFlag).toBe(true);
  });
  test("필터 액션 상태 확인", () => {
    expect(store.state.filter).toBe("all");

    store.dispatch({ type: "TodoActionFilter", payload: { filter: "active" } });
    expect(store.state.filter).toBe("active");

    store.dispatch({
      type: "TodoActionFilter",
      payload: { filter: "completed" },
    });
    expect(store.state.filter).toBe("completed");

    store.dispatch({ type: "TodoActionFilter", payload: { filter: "all" } });
    expect(store.state.filter).toBe("all");
  });

  test("CRUD 액션 상태 확인", () => {
    // 0. 초기 상태
    expect(store.state.items).toEqual([]);

    // a, b, c, d 삽입
    store.dispatch({ type: "TodoActionCreate", payload: { text: "a" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "b" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "c" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "d" } });

    // 1. 역순 삽입 확인
    expect(getContents(store)).toEqual([
      { text: "d", completed: false, id: "4" },
      { text: "c", completed: false, id: "3" },
      { text: "b", completed: false, id: "2" },
      { text: "a", completed: false, id: "1" },
    ]);

    // 삭제
    store.dispatch({ type: "TodoActionDelete", payload: { id: "3" } });

    // 2. 삭제 확인
    expect(getContents(store)).toEqual([
      { text: "d", completed: false, id: "4" },
      { text: "b", completed: false, id: "2" },
      { text: "a", completed: false, id: "1" },
    ]);

    // 토글 실행
    store.dispatch({ type: "TodoActionToggle", payload: { id: "4" } });
    store.dispatch({ type: "TodoActionToggle", payload: { id: "2" } });

    // 3. 토글 위치 변경 확인
    expect(getContents(store)).toEqual([
      { text: "a", completed: false, id: "1" },
      { text: "d", completed: true, id: "4" },
      { text: "b", completed: true, id: "2" },
    ]);

    // 완료 항목 삭제 실행
    store.dispatch({ type: "TodoActionClearCompleted" });

    // 4. completed 삭제 확인
    expect(getContents(store)).toEqual([
      { text: "a", completed: false, id: "1" },
    ]);

    // 추가 데이터 삽입
    store.dispatch({ type: "TodoActionCreate", payload: { text: "b" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "c" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "d" } });

    // 5. 삽입 확인
    expect(getContents(store)).toEqual([
      { text: "d", completed: false, id: "7" },
      { text: "c", completed: false, id: "6" },
      { text: "b", completed: false, id: "5" },
      { text: "a", completed: false, id: "1" },
    ]);

    store.dispatch({ type: "TodoActionCreate", payload: { text: "b" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "c" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "d" } });
  });
  test("Move 액션 상태 확인", () => {
    // 초기 데이터 삽입
    store.dispatch({ type: "TodoActionCreate", payload: { text: "a" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "b" } });
    store.dispatch({ type: "TodoActionCreate", payload: { text: "c" } });
    expect(getContents(store)).toEqual([
      { text: "c", completed: false, id: "3" },
      { text: "b", completed: false, id: "2" },
      { text: "a", completed: false, id: "1" },
    ]);

    store.dispatch({
      type: "TodoActionMove",
      payload: { fromId: "1", toId: "3" },
    });

    expect(getContents(store)).toEqual([
      { text: "c", completed: false, id: "3" },
      { text: "a", completed: false, id: "1" },
      { text: "b", completed: false, id: "2" },
    ]);

    store.dispatch({
      type: "TodoActionMove",
      payload: { fromId: "3", toId: "2" },
    });

    expect(getContents(store)).toEqual([
      { text: "a", completed: false, id: "1" },
      { text: "b", completed: false, id: "2" },
      { text: "c", completed: false, id: "3" },
    ]);
  });
});
