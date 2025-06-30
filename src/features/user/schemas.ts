import { Role } from '@prisma/client';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

export const createUserSchema = userSchema.omit({ id: true });

export const updateUserSchema = userSchema.omit({ password: true });
