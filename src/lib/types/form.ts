export interface FormState<T = unknown> {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
  data?: T;
}
