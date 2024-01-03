import { arrayUtil } from "../../../../module/arrayUtil/arrayUtil";
import { addOnceEventListener } from "../../../../module/domUtil/addOnceEventListener";
import { DftCustomEvent } from "../../../../module/dragFromTo/public";
import { TodoStore } from "../../../store/createTodoStore";
import { createTodoElement } from "./createTodoElement";

export function updateTodoList(
  todoListView: HTMLElement,
  todoStore: TodoStore
) {
  // drag
  addOnceEventListener(todoListView, DftCustomEvent.PREVIEW, (e: Event) => {
    const filteredItems = getItemsWithFilter(todoStore);
    const { fromId, toId } = (e as CustomEvent).detail;

    const fromIndex = filteredItems.findIndex((v) => v.id === fromId);
    const toIndex = filteredItems.findIndex((v) => v.id === toId);
    if (fromIndex === -1 || toIndex === -1)
      throw new Error(`dev error fromId:${fromId}, toId:${toId}`);

    const previeweItems = arrayUtil.moveToNext(
      filteredItems,
      fromIndex,
      toIndex
    );
    reflowElement(todoListView, todoStore, previeweItems);
  });

  const filteredItems = getItemsWithFilter(todoStore);
  reflowElement(todoListView, todoStore, filteredItems);
}

type VisibleTodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

function reflowElement(
  todoListView: HTMLElement,
  todoStore: TodoStore,
  visibleItems: VisibleTodoItem[]
) {
  // 2. reuse OR create element
  const visibleIdSet = new Set(visibleItems.map((v) => v.id));
  const todoElementMap = makeTodoElementMap(todoListView, visibleIdSet);
  const todoElements = visibleItems.map((v) => {
    // reuse
    if (todoElementMap.has(v.id)) {
      const todoElement = todoElementMap.get(v.id)!;
      if (v.completed) todoElement.classList.add("completed");
      else todoElement.classList.remove("completed");
      return todoElement;
    }

    // create
    const todoElement = createTodoElement(todoListView, todoStore, {
      id: v.id,
      text: v.text,
      completed: v.completed,
    });

    return todoElement;
  });

  // 3. reflow
  todoListView.replaceChildren(...todoElements);
}

function getItemsWithFilter(todoStore: TodoStore) {
  const visibleItems: VisibleTodoItem[] = todoStore.state.items.filter((v) => {
    if (todoStore.state.filter === "active") return !v.completed;
    if (todoStore.state.filter === "completed") return v.completed;
    return true;
  });
  return visibleItems;
}

function makeTodoElementMap(
  todoListView: HTMLElement,
  visibleIdSet: Set<string>
) {
  const domLiMap = new Map<string, HTMLElement>();
  for (const child of todoListView.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === "LI") {
      const li = child as HTMLElement;
      if (visibleIdSet.has(li.id)) domLiMap.set(li.id, li);
    }
  }
  return domLiMap;
}
