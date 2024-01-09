import { arrayUtil } from "../../../module/arrayUtil/arrayUtil";
import { createElementClassname } from "../../../module/domUtil/createElementExtend";
import { Dragger } from "../../../module/dragState/index";
import { TodoStore } from "../../store/createTodoStore";
import { DraggerLogic as DragLogic } from "./units/DragLogic";
import { getFilteredItem } from "./units/getFilteredItem";
import { reflowElement } from "./units/reflowElement";
import { updateTodoList } from "./units/updateTodoList";

export function createTodoListView(parent: HTMLElement, todoStore: TodoStore) {
  const todoListView = createElementClassname(parent, "ul", "todoListView");

  const dragLogic = new DragLogic(parent);

  new Dragger(
    todoListView,
    200,
    (param, e) => {
      switch (param) {
        case "init_down_try": {
          if (e === undefined) throw new Error("dev bug");
          if (e.target === null) throw new Error("check");
          if (!(e.target instanceof Element)) return false;
          if (e.target instanceof HTMLButtonElement) return false;

          const eleTodo = e.target.closest(".todoElement");
          if (!(eleTodo instanceof HTMLLIElement)) return false;
          if (eleTodo.dataset.completed === "true") return false;
          dragLogic.setFrom(eleTodo, e);
          return true;
        }

        case "ready_move_try_cancel": {
          if (e === undefined) throw new Error("dev bug");
          if (e.target === null) throw new Error("check");
          if (!(e.target instanceof Element)) throw new Error("check");
          const eleTarget = e.target as Element;

          const eleTodo = eleTarget.closest(".todoElement");
          if (!(eleTodo instanceof HTMLLIElement)) return false;

          if (dragLogic.from === eleTodo) {
            dragLogic.setFrom(eleTodo, e);
            return false;
          }
          return true;
        }

        case "ready_start_dragging": {
          dragLogic.start();
          return;
        }

        case "dragging_move":
          {
            if (e === undefined) throw new Error("dev bug");
            if (!(e.target instanceof Element)) return;
            dragLogic.moveDragElement(e);

            const eleTodo = e.target.closest(".todoElement");
            if (
              !eleTodo ||
              !(eleTodo instanceof HTMLLIElement) ||
              eleTodo.dataset.completed === "true"
            ) {
              dragLogic.cleanTo();
              return;
            }

            if (eleTodo === dragLogic.from) {
              dragLogic.cleanTo();
              return;
            }

            if (eleTodo !== dragLogic.to) {
              dragLogic.cleanTo();
              dragLogic.setTo(eleTodo);
              return;
            }

            dragLogic.tryPreview((fromId: string, previewToId: string) => {
              const filteredItems = getFilteredItem(todoStore);
              const fromIndex = filteredItems.findIndex((v) => v.id === fromId);
              const toIndex = filteredItems.findIndex(
                (v) => v.id === previewToId
              );
              if (fromIndex === -1 || toIndex === -1)
                throw new Error(
                  `dev error fromId:${fromId}, previewToId:${previewToId}`
                );
              const previeweItems = arrayUtil.moveToNext(
                filteredItems,
                fromIndex,
                toIndex
              );
              reflowElement(todoListView, todoStore, previeweItems);
            });
          }
          break;

        case "dragging_end":
          {
            if (dragLogic.from && dragLogic.to) {
              todoStore.dispatch({
                type: "TodoActionMove",
                payload: {
                  fromId: dragLogic.from.id,
                  toId: dragLogic.to.id,
                },
              });
            }
            dragLogic.clean();
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
      dragLogic.clean(() => updateTodoList(todoListView, todoStore));
    }
  );

  todoListView.onclick = (e) => {
    if (!(e.target instanceof Element)) return;
    // 내부 제거 버튼을 무시하는 토글 기능이기 때문에, 상단에서 위임에 대한 처리 필요.
    if (e.target instanceof HTMLButtonElement) return;
    const eleTodo = e.target.closest(".todoElement");
    if (eleTodo instanceof HTMLLIElement) {
      todoStore.dispatch({
        type: "TodoActionToggle",
        payload: {
          id: eleTodo.id,
        },
      });
    }
  };

  // init render
  updateTodoList(todoListView, todoStore);

  // subscribe
  todoStore.subscribe(() => updateTodoList(todoListView, todoStore));
}
