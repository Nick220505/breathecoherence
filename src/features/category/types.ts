import type { z } from 'zod';

import type {
  categorySchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from './schemas';

export type CategoryData = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryData = z.infer<typeof deleteCategorySchema>;
