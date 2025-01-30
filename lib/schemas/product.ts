import { Product } from "@prisma/client";
import { z } from "zod";

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

export function toFormData(product: Product): ProductFormData {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    type: product.type as "Flower Essence" | "Sacred Geometry",
    price: product.price.toString(),
    stock: product.stock.toString(),
    imageUrl: product.imageUrl || undefined,
  };
}

export type ProductFormData = z.infer<typeof productSchema>;
