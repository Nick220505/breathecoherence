import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateCategorySchema = categorySchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const createCategorySchema = updateCategorySchema.omit({ id: true });

export const deleteCategorySchema = z.string();

export type Category = z.infer<typeof categorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
