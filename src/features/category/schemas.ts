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

export const categoryArraySchema = z.array(categorySchema);

export const categoryCountSchema = z.number();

export type CategoryData = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
