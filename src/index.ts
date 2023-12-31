import { makeTodoModule } from "./Todo/index";
import "./index.css";
import { createElementClassname } from "./module/domUtil/createElementExtend";

const root = document.getElementById("root");
if (root) {
  const todoModuleConatiner = createElementClassname(
    root,
    "div",
    "todoModuleConatiner"
  );
  makeTodoModule(todoModuleConatiner);
}
