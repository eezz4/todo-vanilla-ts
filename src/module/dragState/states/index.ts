export type StateType = "Init" | "Ready" | "Drag";
export interface iDragState {
  getType(): StateType;
}
