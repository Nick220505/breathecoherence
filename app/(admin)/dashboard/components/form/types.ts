export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  type: string;
  price: string;
  stock: string;
  imageUrl?: string;
}

export interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}
