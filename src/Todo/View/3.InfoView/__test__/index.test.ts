import { removeWhitespace } from "../../../../module/stringUtil/stringUtil";
import { createTodoStore } from "../../../store/createTodoStore";
import { createTodoInfoView } from "../index";

const expectedHtml = removeWhitespace(`
<div class="todoInfoView">
  <span class="todoInfoLabel">0 items left</span>
  <div class="todoInfoFilter">
  <button class="on">All</button>
  <button>Active</button>
  <button>Completed</button>
  </div>
  <button>Clear Completed (0)</button>
</div>
`);

describe("InfoView 확인", () => {
  test("createTodoInfoView 확인", () => {
    const store = createTodoStore();
    expect(store.state.filter).toBe("all");

    const container = document.createElement("div");
    createTodoInfoView(container, store);
    const inputView = container.firstChild as HTMLElement;

    expect(removeWhitespace(inputView.outerHTML)).toEqual(expectedHtml);

    store.dispatch({ type: "TodoActionCreate", payload: { text: "a" } });
    expect(container.querySelector(".todoInfoLabel")?.textContent).toBe(
      "1 items left"
    );

    store.dispatch({ type: "TodoActionToggle", payload: { id: "1" } });
    expect(container.querySelectorAll("button")[3].textContent).toBe(
      "Clear Completed (1)"
    );

    expect(container.querySelector(".on")?.textContent).toBe("All");

    const activeBtn = container.querySelectorAll("button")[1];
    expect(activeBtn).toBeTruthy();

    activeBtn.dispatchEvent(new Event("click"));
    expect(container.querySelector(".on")?.textContent).toBe("Active");
  });
});
