import { ProductType } from '@prisma/client';
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.nativeEnum(ProductType),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be a positive integer'),
  imageUrl: z.union([
    z.string().url('Image URL must be a valid URL'),
    z.string().max(0),
    z.null(),
    z.undefined(),
  ]),
});

export type ProductFormData = z.infer<typeof productSchema>;
