"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormData } from "@/types/product";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Flower Essence", "Sacred Geometry"], {
    required_error: "Type is required",
  }),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a whole number"),
  imageUrl: z.string().optional(),
});

export interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}

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
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
      },
    });

    revalidateTag("products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/store");

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
  const validatedFields = productSchema.safeParse(data);

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
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
      },
    });

    revalidateTag("products");
    revalidateTag("single-product");
    revalidatePath("/admin/dashboard");
    revalidatePath("/store");

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
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/store");

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
