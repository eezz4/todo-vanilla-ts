import { createElementClassname } from "../../../../module/domUtil/createElementExtend";
import { TodoStore } from "../../../store/createTodoStore";

export function createTodoElement(
  todoListView: HTMLElement,
  todoStore: TodoStore,
  element: {
    id: string;
    text: string;
  }
) {
  const todoElement = createElementClassname(todoListView, "li", "todoElement");
  todoElement.id = element.id;

  // content
  const content = createElementClassname(todoElement, "span", "content");
  content.textContent = element.text;

  // remove btn
  const deleteBtn = createElementClassname(todoElement, "button", "deleteBtn");
  deleteBtn.textContent = "삭제";
  deleteBtn.onclick = () => {
    todoStore.dispatch({
      type: "TodoActionDelete",
      payload: { id: element.id },
    });
  };

  return todoElement;
}
