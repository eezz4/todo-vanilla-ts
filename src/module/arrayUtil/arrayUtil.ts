function insert<T>(array: T[], index: number, item: T) {
  array.splice(index, 0, item);
}

function move<T>(array: T[], fromIndex: number, toIndex: number) {
  const from = array[fromIndex];
  insert(array, toIndex + 1, from);
  const deleteIndex = toIndex < fromIndex ? fromIndex + 1 : fromIndex;
  array.splice(deleteIndex, 1);
  return array;
}

export const arrayUtil = {
  insert,
  move,
};
