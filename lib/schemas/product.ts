import { z } from "zod";

export const prismaProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(["Flower Essence", "Sacred Geometry"]),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof prismaProductSchema>;

export function toFormData(product: Product): ProductFormData {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    type: product.type,
    price: product.price.toString(),
    stock: product.stock.toString(),
    imageUrl: product.imageUrl || undefined,
  };
}

export const productSchema = z.object({
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

export type ProductFormData = z.infer<typeof productSchema>;

export interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}
