import { arrayUtil } from "../arrayUtil";

describe("arrayUtil", () => {
  test("삽입 확인", () => {
    let array = [1, 2, 3, 4];
    arrayUtil.insert(array, 0, 5);
    expect(array).toEqual([5, 1, 2, 3, 4]);

    array = [1, 2, 3, 4];
    arrayUtil.insert(array, 4, 5);
    expect(array).toEqual([1, 2, 3, 4, 5]);

    array = [1, 2, 3, 4];
    arrayUtil.insert(array, 2, 5);
    expect(array).toEqual([1, 2, 5, 3, 4]);
  });

  test("이동 확인", () => {
    let array = [1, 2, 3, 4];
    arrayUtil.moveToNext(array, 0, 3);
    expect(array).toEqual([2, 3, 4, 1]);

    array = [1, 2, 3, 4];
    arrayUtil.moveToNext(array, 0, 2);
    expect(array).toEqual([2, 3, 1, 4]);

    array = [1, 2, 3, 4];
    arrayUtil.moveToNext(array, 2, 0);
    expect(array).toEqual([1, 3, 2, 4]); // 0번 인덱스 다음으로 이동

    array = [1, 2, 3, 4];
    arrayUtil.moveToNext(array, 3, 0);
    expect(array).toEqual([1, 4, 2, 3]);

    array = [1, 2, 3, 4];
    arrayUtil.moveToNext(array, 0, 4); // to Index 초과 허용
    expect(array).toEqual([2, 3, 4, 1]);
  });
});
