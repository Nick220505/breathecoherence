"use server";

import { createProduct, deleteProduct, updateProduct } from "@/db/products";
import { productSchema } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { revalidateTag } from "next/cache";

export async function productFormAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = productSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  const { id, ...productData } = data;
  const result = id
    ? await updateProduct(id, productData)
    : await createProduct(productData);

  if (result.success) {
    revalidateTag("products");
    if (id) revalidateTag("product");
  }

  return result;
}

export { deleteProduct };
