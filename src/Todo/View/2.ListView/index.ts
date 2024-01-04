import { cloneElementForDrag } from "../../../module/domUtil/cloneElementForDrag";
import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { Dragger } from "../../../module/dragState/index";
import { TodoStore } from "../../store/createTodoStore";
import { updateTodoList } from "./units/updateTodoList";

export function createTodoListView(parent: HTMLElement, todoStore: TodoStore) {
  const todoListView = createElementClassname(parent, "ul", "todoListView");
  const dragElement = createElementClassname(parent, "div", "gDragElement");
  dragElement.style.display = "none";

  const state = {
    from: null as HTMLElement | null,
    to: null as HTMLElement | null,

    startPageX: 0,
    startPageY: 0,
    offsetX: 0,
    offsetY: 0,
  };
  new Dragger(
    todoListView,
    200,
    (param, e) => {
      switch (param) {
        case "init_down_try": {
          if (e === undefined) throw new Error("dev bug");
          if (e.target === null) throw new Error("check");
          if (!(e.target instanceof Element)) return false;
          const eleTarget = e.target as Element;
          if (eleTarget.nodeName === "BUTTON") return false;

          const eleTodo = eleTarget.closest(".todoElement");
          if (eleTodo === null || !(eleTodo instanceof HTMLLIElement))
            return false;
          if (eleTodo.dataset.completed === "true") return false;
          state.from = eleTodo;

          state.startPageX = e.pageX;
          state.startPageY = e.pageY;
          const rect = state.from.getBoundingClientRect();
          state.offsetX = state.startPageX - rect.left;
          state.offsetY = state.startPageY - rect.top;
          return true;
        }
        case "ready_move_try_cancel": {
          if (e === undefined) throw new Error("dev bug");
          if (e.target === null) throw new Error("check");
          if (!(e.target instanceof Element)) throw new Error("check");
          const eleTarget = e.target as Element;

          const eleTodo = eleTarget.closest(".todoElement");
          if (eleTodo === null || !(eleTodo instanceof HTMLLIElement))
            return false;

          if (state.from === eleTodo) {
            state.startPageX = e.pageX;
            state.startPageY = e.pageY;

            const rect = state.from.getBoundingClientRect();
            state.offsetX = state.startPageX - rect.left;
            state.offsetY = state.startPageY - rect.top;
            return false;
          }
          return true;
        }
        case "ready_start_dragging": {
          if (state.from === null) throw new Error("dev error");
          dragElement.appendChild(cloneElementForDrag(state.from));
          dragElement.style.display = "";
          dragElement.style.left = state.startPageX - state.offsetX + "px";
          dragElement.style.top = state.startPageY - state.offsetY + "px";

          state.from.style.opacity = "0.5";
          state.from.style.background = "green";
          return;
        }
        case "dragging_move":
          {
            if (e === undefined) throw new Error("dev bug");
            if (!(e.target instanceof Element)) return;
            if (state.to) state.to.style.borderBottom = "";

            dragElement.style.left = e.pageX - state.offsetX + "px";
            dragElement.style.top = e.pageY - state.offsetY + "px";

            const eleTarget = e.target as Element;
            const eleTodo = eleTarget.closest(".todoElement");
            if (
              eleTodo &&
              eleTodo instanceof HTMLLIElement &&
              eleTodo.dataset.completed === "false"
            )
              state.to = eleTodo;
            else {
              state.to = null;
            }
            if (state.to) state.to.style.borderBottom = "20px solid green";
          }
          break;
        case "dragging_end":
          {
            console.log("state.from::: ", state.from);
            console.log("state.to::: ", state.to);
            dragElement.innerHTML = "";
            dragElement.style.display = "none";
            if (state.to) state.to.style.borderBottom = "";
            if (state.from) {
              state.from.style.opacity = "";
              state.from.style.background = "";
            }
          }
          break;
        default:
          throw new Error("not implement error.");
      }
    },
    (param, e) => {
      switch (param) {
        case "try_cancel":
          if (e.key === "Escape") return true;
          break;
        default:
          throw new Error("not implement error.");
      }
      return false;
    },
    () => {
      dragElement.innerHTML = "";
      dragElement.style.display = "none";
      if (state.to) state.to.style.borderBottom = "";
      if (state.from) {
        state.from.style.opacity = "";
        state.from.style.background = "";
      }
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
