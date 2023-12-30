import "./index.css";
const root = document.getElementById("root");
if (root) {
  makeScreen(root);
}

export function makeScreen(root: HTMLElement) {
  const p = document.createElement("p");
  p.textContent = "hi";

  root.appendChild(p);

  root.addEventListener("click", () => {
    alert("clicked!");
  });
}
