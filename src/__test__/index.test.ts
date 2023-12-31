describe("인덱스 파일의 기본 동작 확인", () => {
  beforeAll(() => {
    document.body.innerHTML = `<div id="root"/>`;
  });

  test("root가 존재하는지?", () => {
    const root = document.getElementById("root");
    expect(root).toBeInTheDocument();
  });
});
