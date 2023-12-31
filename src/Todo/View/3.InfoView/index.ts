import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../store/createTodoStore";
import { createInfoLabel } from "./units/1.createInfoLabel";
import { createFilterBtns } from "./units/2.createFilterBtns";
import { createClearBtn } from "./units/3.createClearBtn";

export function createTodoInfoView(parent: HTMLElement, todoStore: TodoStore) {
  const todoInfoView = createElementClassname(parent, "div", "todoInfoView");
  createInfoLabel(todoInfoView, todoStore);
  createFilterBtns(todoInfoView, todoStore);
  createClearBtn(todoInfoView, todoStore);
}
