export interface ActionState<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FormState<T = unknown> {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
  data?: T;
}
