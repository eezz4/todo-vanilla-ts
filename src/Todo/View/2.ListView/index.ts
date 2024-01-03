import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { DftCustomEvent } from "../../../module/dragFromTo/public";
import { Dragger } from "../../../module/dragState/index";
import { TodoStore } from "../../store/createTodoStore";
import { updateTodoList } from "./units/updateTodoList";

export function createTodoListView(parent: HTMLElement, todoStore: TodoStore) {
  const todoListView = createElementClassname(parent, "ul", "todoListView");

  new Dragger(
    todoListView,
    (param, e) => {
      console.log("---CB:", param);
      switch (param) {
        case "init_down_ok":
          return true;
          break;
        case "ready_move_try_cancel":
          return false;
          break;
        case "dragging_move":
          break;
        case "dragging_end":
          break;
        default:
          break;
      }
      return true;
    },
    (param, e) => {
      console.log("---CB:", param);
      switch (param) {
        case "try_cancel":
          if (e.key === "Escape") return true;
          break;
        default:
          throw new Error("");
      }
      return false;
    },
    () => {
      console.log("---CB:", "cancel");
    }
  );

  todoListView.onclick = (e) => {
    const targetElement = e.target as HTMLElement;
    if (targetElement.nodeType !== Node.ELEMENT_NODE) return;
    // 동기 Flux 디자인 => Btn 버블링 무시 필요
    const totoElement = findParentLIExcludeBtn(targetElement);
    if (totoElement === null) return;

    todoStore.dispatch({
      type: "TodoActionToggle",
      payload: {
        id: totoElement.id,
      },
    });
  };

  todoListView.addEventListener(DftCustomEvent.SUCCESS, (e: Event) => {
    todoStore.dispatch({
      type: "TodoActionMove",
      payload: (e as CustomEvent).detail,
    });
  });
  todoListView.addEventListener(DftCustomEvent.CANCEL, () => {
    updateTodoList(todoListView, todoStore);
  });

  // init render
  updateTodoList(todoListView, todoStore);

  // subscribe
  todoStore.subscribe(() => updateTodoList(todoListView, todoStore));
}

function findParentLIExcludeBtn(element: HTMLElement | null) {
  while (element) {
    if (element.tagName === "BUTTON") return null;
    if (element.tagName === "LI") return element;
    element = element.parentElement;
  }
  return null;
}

function skipElementCond(element: HTMLElement) {
  if (element.tagName === "BUTTON") return true;
  for (const classname of element.classList) {
    if (classname === "completed") return true;
  }
  return false;
}
