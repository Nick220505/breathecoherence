import type { z } from 'zod';

import type {
  cartItemSchema,
  createProductSchema,
  productSchema,
  productSummarySchema,
  productWithCategorySchema,
  updateProductSchema,
} from './schemas';

export type ProductData = z.infer<typeof productSchema>;
export type CreateProductData = z.infer<typeof createProductSchema>;
export type UpdateProductData = z.infer<typeof updateProductSchema>;
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ProductSummary = z.infer<typeof productSummarySchema>;
