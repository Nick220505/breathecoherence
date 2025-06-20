import { Role } from '@prisma/client';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(Role),
});

export type UserFormData = z.infer<typeof userSchema>;
