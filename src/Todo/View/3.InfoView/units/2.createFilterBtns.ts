import { createElementClassname } from "../../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../../store/createTodoStore";

export function createFilterBtns(
  todoInfoView: HTMLElement,
  todoStore: TodoStore
) {
  const todoInfoFilter = createElementClassname(
    todoInfoView,
    "div",
    "todoInfoFilter"
  );

  // 1.
  const allBtn = createElementClassname(todoInfoFilter, "button");
  allBtn.textContent = "All";
  allBtn.onclick = () => {
    todoStore.dispatch({
      type: "TodoActionFilter",
      payload: { filter: "all" },
    });
    updateFilterBtns("all");
  };

  // 2.
  const activeBtn = createElementClassname(todoInfoFilter, "button");
  activeBtn.textContent = "Active";
  activeBtn.onclick = () => {
    todoStore.dispatch({
      type: "TodoActionFilter",
      payload: { filter: "active" },
    });
    updateFilterBtns("active");
  };

  // 3.
  const completedBtn = createElementClassname(todoInfoFilter, "button");
  completedBtn.textContent = "Completed";
  completedBtn.onclick = () => {
    todoStore.dispatch({
      type: "TodoActionFilter",
      payload: { filter: "completed" },
    });
    updateFilterBtns("completed");
  };

  // init render
  updateFilterBtns(todoStore.state.filter);

  function updateFilterBtns(btnType: "all" | "active" | "completed") {
    allBtn.classList.remove("on");
    activeBtn.classList.remove("on");
    completedBtn.classList.remove("on");
    if (btnType === "all") allBtn.classList.add("on");
    else if (btnType === "active") activeBtn.classList.add("on");
    else if (btnType === "completed") completedBtn.classList.add("on");
  }
}
