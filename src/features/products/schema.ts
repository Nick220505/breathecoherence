import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['Flower Essence', 'Sacred Geometry'], {
    required_error: 'Type is required',
  }),
  price: z.coerce.number().min(0, 'Price must be greater than or equal to 0'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative number'),
  imageUrl: z.string().nullable().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
