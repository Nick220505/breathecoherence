import { z } from 'zod';

import { categorySchema } from '@/features/category/schemas';

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  imageBase64: z
    .union([z.string().startsWith('data:image/'), z.string().max(0), z.null()])
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryId: z.string().min(1),
});

export const updateProductSchema = productSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const createProductSchema = updateProductSchema.omit({ id: true });

export const deleteProductSchema = z.string();

export const getProductByIdSchema = z.string();

export const productWithCategorySchema = productSchema.extend({
  category: categorySchema,
});

export const cartItemSchema = productSchema.extend({
  quantity: z.number().int().min(1),
});

export const productSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageBase64: z.string().nullable(),
  category: z
    .object({
      name: z.string(),
    })
    .optional(),
});

export type ProductData = z.infer<typeof productSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ProductSummary = z.infer<typeof productSummarySchema>;
