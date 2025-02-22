export interface ActionState<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
