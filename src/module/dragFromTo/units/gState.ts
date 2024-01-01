type OptionalTimeout = NodeJS.Timeout | undefined;
type NullableCallableFunction = CallableFunction | null;

export const gState = {
  run: false,
  readyRunId: undefined as OptionalTimeout,
  previewId: undefined as OptionalTimeout,
  previewCancel: null as NullableCallableFunction,
  delegationClick: true,
  fromOffsetX: 0,
  fromOffsetY: 0,
};
