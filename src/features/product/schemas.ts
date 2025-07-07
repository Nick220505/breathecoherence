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

export const deleteProductSchema = z.object({ id: z.string() });

export const getProductByIdSchema = z.object({ id: z.string() });

export const productArraySchema = z.array(productSchema);

export const productCountSchema = z.number();

export const productWithCategorySchema = productSchema.extend({
  category: categorySchema,
});

export const productWithCategoryArraySchema = z.array(
  productWithCategorySchema,
);
