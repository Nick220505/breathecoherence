import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  imageBase64: z
    .union([
      z.string().startsWith('data:image/'),
      z.string().max(0),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});

export const createProductSchema = productSchema.omit({ id: true });

export const updateProductSchema = productSchema;
