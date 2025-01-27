"use server";

import { createProduct, updateProduct } from "./product";

interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}

export async function productFormAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    imageUrl: formData.get("imageUrl") as string,
  };

  const productId = formData.get("id") as string;

  if (productId) {
    return updateProduct(productId, rawFormData);
  }
  return createProduct(rawFormData);
}
