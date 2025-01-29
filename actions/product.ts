"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormData } from "@/types/product";
import { revalidateTag, unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  id: z.string().optional(),
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

const CACHE_TAGS = {
  products: "products",
  singleProduct: "single-product",
  store: "store",
} as const;

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
    tags: [CACHE_TAGS.products],
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
    tags: [CACHE_TAGS.products, CACHE_TAGS.singleProduct],
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

    revalidateTag(CACHE_TAGS.products);
    revalidateTag(CACHE_TAGS.store);

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
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
      },
    });

    revalidateTag(CACHE_TAGS.products);
    revalidateTag(CACHE_TAGS.singleProduct);
    revalidateTag(CACHE_TAGS.store);

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

    revalidateTag(CACHE_TAGS.products);
    revalidateTag(CACHE_TAGS.singleProduct);
    revalidateTag(CACHE_TAGS.store);

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
  const validatedFields = productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });

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
