"use server";

import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormData } from "@/lib/schemas/product";
import { FormState } from "@/lib/types/form";
import { revalidateTag, unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const getProducts = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
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
  },
  ["products"],
  {
    revalidate: 3600,
    tags: ["products"],
  },
);

export const getProductById = unstable_cache(
  async (id: string) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        notFound();
      }

      return product;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch product",
      );
    }
  },
  ["product"],
  {
    revalidate: 3600,
    tags: ["products", "single-product"],
  },
);

export async function createProduct(data: ProductFormData): Promise<FormState> {
  const validatedFields = productSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below",
      success: false,
    };
  }

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
      },
    });

    revalidateTag("products");
    revalidateTag("store");

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
  const validatedFields = productSchema.safeParse({ ...data, id });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below",
      success: false,
    };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
      },
    });

    revalidateTag("products");
    revalidateTag("single-product");
    revalidateTag("store");

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
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!product) {
      return {
        errors: {},
        message: "Product not found",
        success: false,
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidateTag("products");
    revalidateTag("single-product");
    revalidateTag("store");

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
  const data = {
    ...rawData,
    price: Number(rawData.price),
    stock: Number(rawData.stock),
  };

  const validatedFields = productSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fill in all required fields and ensure they are valid",
      success: false,
    };
  }

  const { id, ...productData } = validatedFields.data;

  if (id) {
    return updateProduct(id, productData);
  }

  return createProduct(productData);
}
