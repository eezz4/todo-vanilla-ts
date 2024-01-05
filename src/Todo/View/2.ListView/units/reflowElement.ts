import { TodoStore } from "../../../store/createTodoStore";
import { createTodoElement } from "./createTodoElement";

type UiTodoElement = {
  id: string;
  text: string;
  completed: boolean;
};

export function reflowElement(
  todoListView: HTMLElement,
  todoStore: TodoStore,
  filteredItems: UiTodoElement[]
) {
  // reuse OR create element
  const todoElementMap = makeTodoElementMapFromTodoListView(
    todoListView,
    filteredItems
  );

  const todoElements = filteredItems.map((v) => {
    const todoElement =
      todoElementMap.get(v.id) ??
      createTodoElement(todoListView, todoStore, {
        id: v.id,
        text: v.text,
      });
    todoElementMap.set(v.id, todoElement);

    todoElement.dataset.completed = String(v.completed);
    if (v.completed) todoElement.classList.add("completed");
    else todoElement.classList.remove("completed");

    return todoElement;
  });

  // reflow
  todoListView.replaceChildren(...todoElements);
}

function makeTodoElementMapFromTodoListView(
  todoListView: HTMLElement,
  visibleItems: UiTodoElement[]
) {
  const visibleIdSet = new Set(visibleItems.map((v) => v.id));

  const todoElementMap = new Map<string, HTMLElement>();
  for (const child of todoListView.childNodes) {
    if (child instanceof HTMLLIElement) {
      if (visibleIdSet.has(child.id)) todoElementMap.set(child.id, child);
    }
  }
  return todoElementMap;
}
