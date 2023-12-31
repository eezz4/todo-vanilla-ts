import { createElementClassname } from "../module/domUtil/createElementExtend";
import { createTodoStore } from "./store/createTodoStore";
import { createTodoInputView } from "./View/1.InputView/index";
import { createTodoListView } from "./View/2.ListView/index";
import { createTodoInfoView } from "./View/3.InfoView/index";

export function makeTodoModule(parent: HTMLElement) {
  const todoModule = createTodoModuleOnce(parent);

  const todoStore = createTodoStore();
  createTodoInputView(todoModule, todoStore);
  createTodoListView(todoModule, todoStore);
  createTodoInfoView(todoModule, todoStore);
}

function createTodoModuleOnce(parent: HTMLElement) {
  const MODUEL_ID = "TODO_MODULE";
  for (const child of parent.childNodes) {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      (child as HTMLElement).id === MODUEL_ID
    )
      throw new Error("todoModule은 이미 존재합니다.");
  }
  return createElementClassname(parent, "div", "todoModule");
}
