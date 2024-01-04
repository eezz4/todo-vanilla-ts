import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { Dragger } from "../../../module/dragState/index";
import { TodoStore } from "../../store/createTodoStore";
import { updateTodoList } from "./units/updateTodoList";

export function createTodoListView(parent: HTMLElement, todoStore: TodoStore) {
  const todoListView = createElementClassname(parent, "ul", "todoListView");

  const state = {
    from: -1,
    to: -1,
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
          state.from = Number(eleTodo.id);
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

          return state.from !== Number(eleTodo.id);
        }
        case "ready_start_dragging": {
          console.log("ready_start_dragging::: ");
          // render dragElement
          return;
        }
        case "dragging_move":
          {
            if (e === undefined) throw new Error("dev bug");
            if (!(e.target instanceof Element)) return;
            const eleTarget = e.target as Element;

            const eleTodo = eleTarget.closest(".todoElement");
            if (
              eleTodo &&
              eleTodo instanceof HTMLLIElement &&
              eleTodo.dataset.completed === "false"
            )
              state.to = Number(eleTodo.id);
            else state.to = -1;
          }
          break;
        case "dragging_end":
          {
            console.log("state.from::: ", state.from);
            console.log("state.to::: ", state.to);
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
      console.log("cancel");
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
