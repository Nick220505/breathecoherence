"use server";

import { ActionState } from "@/lib/types/action";
import { FormState } from "@/lib/types/form";
import { Product } from "@prisma/client";
import { productSchema } from "./schema";
import { productService } from "./service";

export const getAllProducts = productService.getAll;

export const getProductById = productService.getById;

export async function createProduct(
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
    const createdProduct = await productService.create(data);

    return {
      errors: {},
      message: "Product created successfully",
      success: true,
      data: createdProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to create product",
      success: false,
    };
  }
}

export async function updateProduct(
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

    if (!id) {
      return {
        errors: {},
        message: "Product ID is required for updating",
        success: false,
      };
    }

    const updatedProduct = await productService.update(id, productData);

    return {
      errors: {},
      message: "Product updated successfully",
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to update product",
      success: false,
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionState<Product>> {
  try {
    const data = await productService.delete(id);
    return { success: true, message: "Product deleted successfully", data };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
