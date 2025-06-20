import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  description: z.string().min(10),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
