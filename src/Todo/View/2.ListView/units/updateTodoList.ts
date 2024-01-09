import { TodoStore } from "../../../store/createTodoStore";
import { getFilteredItem } from "./getFilteredItem";
import { reflowElement } from "./reflowElement";

export function updateTodoList(
  todoListView: HTMLElement,
  todoStore: TodoStore
) {
  const filteredItems = getFilteredItem(todoStore);
  reflowElement(todoListView, todoStore, filteredItems);
}
