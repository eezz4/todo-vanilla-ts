export class DftCustomEvent {
  static SUCCESS = "DRAG_CUSTOM_EVENT_SUCCESS";
  static PREVIEW = "DRAG_CUSTOM_EVENT_PREVIEW";
  static CANCEL = "DRAG_CUSTOM_EVENT_CANCEL";
}

export interface DftSkipCondCallback {
  (element: HTMLElement): boolean;
}
