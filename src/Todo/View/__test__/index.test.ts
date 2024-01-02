import { removeWhitespace } from "../../../module/stringUtil/stringUtil";
import { makeTodoModule } from "../../index";

const expectedHtml = removeWhitespace(`
<div class="todoModule">
    <input class="todoInput" placeholder="What needs to be done?">
    <ul class="todoListView"></ul>
    <divclass="gDragElement" style="pointer-events:none;"></div>
    <div class="todoInfoView">
        <span class="todoInfoLabel">0 items left</span>
        <div class="todoInfoFilter">
        <button class="on">All</button>
        <button>Active</button>
        <button>Completed</button>
        </div>
        <button>Clear Completed (0)</button>
    </div>
</div>
`);

describe("TodoView 생성 확인", () => {
  test("makeTodoModule", () => {
    const container = document.createElement("div");
    makeTodoModule(container);
    expect(removeWhitespace(container.innerHTML)).toEqual(expectedHtml);
  });
});
