import { createElementClassname } from "../../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../../store/createTodoStore";

export function createClearBtn(
  todoInfoView: HTMLElement,
  todoStore: TodoStore
) {
  const clearBtn = createElementClassname(todoInfoView, "button");

  clearBtn.onclick = () =>
    todoStore.dispatch({ type: "TodoActionClearCompleted" });

  // init render
  updateCompletedBtn();

  // subscribe
  todoStore.subscribe(updateCompletedBtn);

  function updateCompletedBtn() {
    const completedCount = todoStore.state.items.filter(
      (v) => v.completed
    ).length;
    clearBtn.textContent = `Clear Completed (${completedCount})`;
  }
}
