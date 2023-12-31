type NullableString = string | null;
const id = {
  from: null as NullableString,
  to: null as NullableString,
};

function setFrom(fromId: string) {
  id.from = fromId;
}
function resetFrom() {
  id.from = null;
}
function setTo(toId: string) {
  id.to = toId;
}
function resetTo() {
  id.to = null;
}
function getIds() {
  return id;
}
function reset() {
  id.from = null;
  id.to = null;
}

export const ids = {
  setFrom,
  resetFrom,
  setTo,
  resetTo,
  getIds,
  reset,
};
