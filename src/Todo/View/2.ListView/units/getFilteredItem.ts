import { TodoStore } from "../../../store/createTodoStore";

export function getFilteredItem(todoStore: TodoStore) {
  const filtered = todoStore.state.items.filter((v) => {
    if (todoStore.state.filter === "active") return !v.completed;
    if (todoStore.state.filter === "completed") return v.completed;
    return true;
  });
  return filtered;
}
