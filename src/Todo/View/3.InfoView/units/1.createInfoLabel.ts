import { createElementClassname } from "../../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../../store/createTodoStore";

export function createInfoLabel(
  todoInfoView: HTMLElement,
  todoStore: TodoStore
) {
  const todoInfoLabel = createElementClassname(
    todoInfoView,
    "span",
    "todoInfoLabel"
  );

  // init render
  updateInfoLabel();
  // subscribe
  todoStore.subscribe(updateInfoLabel);

  function updateInfoLabel() {
    todoInfoLabel.textContent = `${todoStore.state.items.length} items left`;
  }
}
