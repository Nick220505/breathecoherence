export interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}
