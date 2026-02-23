import { Role } from '@/generated/prisma/browser';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(Role),
  emailVerified: z.boolean(),
  verifyToken: z.string().nullable(),
  verifyTokenExpiry: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateUserSchema = userSchema
  .pick({
    id: true,
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    verifyToken: true,
    verifyTokenExpiry: true,
  })
  .partial({
    name: true,
    email: true,
    role: true,
    emailVerified: true,
    verifyToken: true,
    verifyTokenExpiry: true,
  });

export const createUserSchema = userSchema
  .pick({
    name: true,
    email: true,
    password: true,
    role: true,
    verifyToken: true,
    verifyTokenExpiry: true,
  })
  .partial({
    role: true,
    verifyToken: true,
    verifyTokenExpiry: true,
  });

export const deleteUserSchema = z.string();

export const userSummarySchema = userSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UserSummary = z.infer<typeof userSummarySchema>;
