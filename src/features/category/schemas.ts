import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
});

export const createCategorySchema = categorySchema.omit({ id: true });

export const updateCategorySchema = categorySchema;
