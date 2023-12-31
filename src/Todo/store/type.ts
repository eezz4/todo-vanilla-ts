// Type: state
type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: Date;
};
type TodoFilter = "all" | "active" | "completed";
export type TodoState = {
  items: TodoItem[];
  filter: TodoFilter;
};

// type: renderFunction
export type TodoRenderFunction = () => void;

// Type: action
export type TodoAction =
  | TodoActionCreate
  | TodoActionToggle
  | TodoActionDelete
  | TodoActionFilter
  | TodoActionClearCompleted
  | TodoActionMove;

type TodoActionCreate = {
  type: "TodoActionCreate";
  payload: {
    text: string;
  };
};
type TodoActionToggle = {
  type: "TodoActionToggle";
  payload: {
    id: string;
  };
};
type TodoActionDelete = {
  type: "TodoActionDelete";
  payload: {
    id: string;
  };
};
type TodoActionFilter = {
  type: "TodoActionFilter";
  payload: {
    filter: TodoFilter;
  };
};
type TodoActionClearCompleted = {
  type: "TodoActionClearCompleted";
};
type TodoActionMove = {
  type: "TodoActionMove";
  payload: {
    fromId: string;
    toId: string;
  };
};
