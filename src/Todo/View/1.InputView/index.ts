import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../store/createTodoStore";

export function createTodoInputView(parent: HTMLElement, todoStore: TodoStore) {
  const todoInput = createElementClassname(parent, "input", "todoInput");
  todoInput.placeholder = "What needs to be done?";

  todoInput.onkeydown = (e) => {
    if (e.key === "Enter" && todoInput.value) {
      todoStore.dispatch({
        type: "TodoActionCreate",
        payload: {
          text: todoInput.value,
        },
      });
      todoInput.value = "";
    }
  };
}
