import { removeWhitespace } from "../../../../module/stringUtil/stringUtil";
import { createTodoStore } from "../../../store/createTodoStore";
import { createTodoListView } from "../index";

const expectedHtmlListView = removeWhitespace(`
<ul class="todoListView"></ul>
`);
const expectHtmlListItem = removeWhitespace(
  `<li class="todoElement" id="1"><span class="content">a</span><button class="deleteBtn">삭제</button></li>`
);
describe("ListView 확인", () => {
  test("createTodoListView 확인", async () => {
    const store = createTodoStore();
    expect(store.state.items.length).toBe(0);

    const container = document.createElement("div");
    createTodoListView(container, store);
    const listView = container.firstChild as HTMLElement;

    expect(removeWhitespace(listView.outerHTML)).toEqual(expectedHtmlListView);
    // 삽입 렌더링 확인
    store.dispatch({ type: "TodoActionCreate", payload: { text: "a" } });
    const listItem = listView.firstChild as HTMLElement;
    expect(removeWhitespace(listItem.outerHTML)).toEqual(expectHtmlListItem);

    // 토글 확인
    expect(listItem.classList.contains("completed")).toBeFalsy();
    listItem.dispatchEvent(new Event("click", { bubbles: true }));
    expect(listItem.classList.contains("completed")).toBeTruthy();

    // 삭제 렌더링 확인
    expect(listView.children.length).toBe(1);
    listView.querySelector(".deleteBtn")?.dispatchEvent(new Event("click"));
    expect(listView.children.length).toBe(0);
  });
});
