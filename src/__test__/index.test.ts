import { makeScreen } from "../index";

describe("인덱스 파일의 기본 동작 확인", () => {
  beforeAll(() => {
    document.body.innerHTML = `<div id="root"/>`;
  });

  test("root가 존재하는지?", () => {
    const root = document.getElementById("root");
    expect(root).toBeInTheDocument();
  });
  test("hi가 만들어졌는지?", () => {
    const root = document.getElementById("root")!;
    makeScreen(root);
    // 첫번째 태그, 텍스트, 주석?
    expect(root.firstChild?.textContent).toEqual("hi");

    // 첫번째 태그
    expect(root.firstElementChild?.textContent).toEqual("hi");
  });
});
