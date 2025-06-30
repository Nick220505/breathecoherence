import type { z } from 'zod';
import type { userSchema, createUserSchema, updateUserSchema } from './schemas';
import type { Role } from '@prisma/client';

export type UserData = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
