import { arrayUtil } from "../../module/arrayUtil/arrayUtil";
import { TodoAction, TodoRenderFunction, TodoState } from "./type";

export type TodoStore = ReturnType<typeof createTodoStore>;

export function createTodoStore() {
  let maxId = 0;

  const state: TodoState = {
    items: getTestData(),
    // items: [],
    filter: "all",
  };

  const listener: TodoRenderFunction[] = [];
  function subscribe(render: TodoRenderFunction) {
    listener.push(render);
  }
  /**
   * @description Always Sync render, whether immutable or not.
   */
  function dispatch(action: TodoAction) {
    switch (action.type) {
      case "TodoActionCreate":
        {
          state.items.unshift({
            id: String(++maxId),
            text: action.payload.text,
            completed: false,
            createdDate: new Date(),
          });
        }
        break;
      case "TodoActionToggle":
        {
          const index = state.items.findIndex(
            (v) => v.id === action.payload.id
          );
          if (index === -1)
            throw new Error(`dev error: ${JSON.stringify(action.payload)}`);
          const targetItem = state.items[index];
          state.items.splice(index, 1);
          const nextComplete = !targetItem.completed;
          targetItem.completed = nextComplete;

          if (nextComplete) {
            state.items.push(targetItem); // 완료는 목록의 하단
          } else {
            const index = state.items.findIndex((v) => {
              // 복귀하면 시간순 => Drag 때문에 시간순 조건이 무너져서, 상단에서부터 비교하고 삽입
              if (targetItem.createdDate > v.createdDate) return true;
              // 완료 아이템 보다는 상단에 위치
              if (v.completed) return true;
            });
            if (index === -1) state.items.push(targetItem);
            else arrayUtil.insert(state.items, index, targetItem);
          }
        }
        break;
      case "TodoActionDelete":
        {
          state.items = state.items.filter((v) => v.id !== action.payload.id);
        }
        break;
      case "TodoActionFilter":
        {
          state.filter = action.payload.filter;
        }
        break;
      case "TodoActionClearCompleted":
        {
          state.items = state.items.filter((v) => !v.completed);
        }
        break;
      case "TodoActionMove":
        {
          const fromIndex = state.items.findIndex(
            (v) => v.id === action.payload.fromId
          );
          const toIndex = state.items.findIndex(
            (v) => v.id === action.payload.toId
          );
          if (fromIndex === -1 || toIndex === -1)
            throw new Error(`dev error: ${JSON.stringify(action.payload)}`);

          arrayUtil.moveToNext(state.items, fromIndex, toIndex);
        }
        break;
      default:
        throw new Error(
          `dispatch: not implerment error: ${JSON.stringify(action)}`
        );
    }

    listener.forEach((render) => render());
  }

  return {
    state,
    dispatch,
    subscribe,
  };
}

/////////////////////////////////
function getTestData() {
  const testData = [
    {
      id: "111",
      completed: true,
      createdDate: new Date(111),
      text: "111",
    },
    {
      id: "222",
      completed: true,
      createdDate: new Date(222),
      text: "222",
    },
    {
      id: "333",
      completed: true,
      createdDate: new Date(333),
      text: "333",
    },
    {
      id: "444",
      completed: false,
      createdDate: new Date(444),
      text: "444",
    },
    {
      id: "555",
      completed: false,
      createdDate: new Date(555),
      text: "555",
    },
    {
      id: "666",
      completed: false,
      createdDate: new Date(666),
      text: "666",
    },
    {
      id: "777",
      completed: false,
      createdDate: new Date(777),
      text: "777",
    },
    {
      id: "888",
      completed: false,
      createdDate: new Date(888),
      text: "888",
    },
    {
      id: "999",
      completed: false,
      createdDate: new Date(999),
      text: "999",
    },
  ];
  testData.reverse();
  return testData;
}
