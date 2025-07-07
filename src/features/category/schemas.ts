import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCategorySchema = categorySchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const categoryArraySchema = z.array(categorySchema);

export const categoryCountSchema = z.number();
