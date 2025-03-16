"use server";

import { ActionState } from "@/lib/types/action";
import { FormState } from "@/lib/types/form";
import { Product } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { productSchema } from "./schema";
import { productService } from "./service";

export async function productFormAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = productSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  try {
    const { id, ...productData } = data;

    if (id) {
      const data = await productService.update(id, productData);
      revalidateTag("products");
      revalidateTag("product");
      return {
        errors: {},
        message: "Product updated successfully",
        success: true,
        data,
      };
    } else {
      const data = await productService.create(productData);
      revalidateTag("products");
      return {
        errors: {},
        message: "Product created successfully",
        success: true,
        data,
      };
    }
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to save product",
      success: false,
    };
  }
}

export async function deleteProductAction(
  id: string,
): Promise<ActionState<Product>> {
  try {
    const data = await productService.delete(id);
    revalidateTag("products");
    revalidateTag("product");
    return { success: true, message: "Product deleted successfully", data };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
