import { z } from 'zod';

// Base schema for category with required id
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
});

// Schema for creating a category (no id required)
export const createCategorySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
});

// Schema for updating a category (id required)
export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(10),
});

// Schema for deleting a category (only id required)
export const deleteCategorySchema = z.object({
  id: z.string().min(1),
});

export type CategoryFormData = z.infer<typeof createCategorySchema>;
export type Category = z.infer<typeof categorySchema>;
