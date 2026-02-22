import type { User } from '@/generated/prisma/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const verifySchema = z.object({
  email: z.email(),
  code: z.string().length(6),
});

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type VerifyData = z.infer<typeof verifySchema>;
