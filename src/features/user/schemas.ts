import { Role } from '@prisma/client';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  emailVerified: z.boolean(),
  verifyToken: z.string().nullable(),
  verifyTokenExpiry: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateUserSchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
});

export const createUserSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
});

export const deleteUserSchema = z.object({ id: z.string() });

export const getUserByIdSchema = z.object({ id: z.string() });

export const userArraySchema = z.array(userSchema);

export const userCountSchema = z.number();

export const userSummarySchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export const userSummaryArraySchema = z.array(userSummarySchema);
