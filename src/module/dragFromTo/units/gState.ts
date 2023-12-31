type NullableTimeout = NodeJS.Timeout | undefined;

export const gState = {
  run: false,
  readyRunId: undefined as NullableTimeout,
  previewId: undefined as NullableTimeout,
  previewCancel: undefined as CallableFunction | undefined,
  delegationClick: true,
  fromOffsetX: 0,
  fromOffsetY: 0,
};
