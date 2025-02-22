import { ProductFormData } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "./prisma";

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!products) {
      throw new Error("Failed to fetch products");
    }

    return products;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products",
    );
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      notFound();
    }

    return product;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch product",
    );
  }
}

export async function createProduct(data: ProductFormData): Promise<FormState> {
  try {
    await prisma.product.create({ data });

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
