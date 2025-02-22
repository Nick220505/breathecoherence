"use server";

import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormData } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { revalidateTag } from "next/cache";

export async function createProduct(data: ProductFormData): Promise<FormState> {
  try {
    await prisma.product.create({ data });

    revalidateTag("products");

    return {
      errors: {},
      message: "Product created successfully",
      success: true,
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
  id: string,
  data: ProductFormData,
): Promise<FormState> {
  try {
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return {
        errors: {},
        message: "Product not found",
        success: false,
      };
    }

    await prisma.product.update({ where: { id }, data });

    revalidateTag("products");
    revalidateTag("product");

    return {
      errors: {},
      message: "Product updated successfully",
      success: true,
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

export async function deleteProduct(id: string): Promise<FormState> {
  if (!id) {
    return {
      errors: {},
      message: "Product ID is required",
      success: false,
    };
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return {
        errors: {},
        message: "Product not found",
        success: false,
      };
    }

    await prisma.product.delete({ where: { id } });

    revalidateTag("products");
    revalidateTag("product");

    return {
      errors: {},
      message: "Product deleted successfully",
      success: true,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to delete product",
      success: false,
    };
  }
}

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

  return id ? updateProduct(id, productData) : createProduct(productData);
}
