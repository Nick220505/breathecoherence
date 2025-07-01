import type { Category, Product } from '@prisma/client';
import type { z } from 'zod';

import type {
  createProductSchema,
  productSchema,
  updateProductSchema,
} from './schemas';

export type ProductData = z.infer<typeof productSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;

export type ProductWithCategory = Product & {
  category: Category;
};

export type PartialProductWithCategory = Partial<Product> & {
  category?: { name: string };
};
