import { sleep } from "../../../../module/promiseUtil/sleep";
import { removeWhitespace } from "../../../../module/stringUtil/stringUtil";
import { createTodoStore } from "../../../store/createTodoStore";
import { createTodoInputView } from "../index";

const expectedHtml = removeWhitespace(`
<input class="todoInput" placeholder="What needs to be done?">
`);

describe("InputView 확인", () => {
  test("createTodoInputView 확인", async () => {
    const store = createTodoStore();
    expect(store.state.items.length).toBe(0);

    const container = document.createElement("div");
    createTodoInputView(container, store);
    const inputView = container.firstChild as HTMLElement;

    expect(removeWhitespace(inputView.outerHTML)).toEqual(expectedHtml);

    inputView.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    sleep(0)
      .then(() => {
        expect(removeWhitespace(inputView.outerHTML)).not.toEqual(expectedHtml);
        inputView.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      })
      .then(() => {
        expect(removeWhitespace(inputView.outerHTML)).toEqual(expectedHtml);
        expect(store.state.items.length).toBe(1);
      });
  });
});
