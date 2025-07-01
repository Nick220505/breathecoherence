import type { User } from '@prisma/client';
import type { z } from 'zod';

import type { loginSchema, registerSchema, verifySchema } from './schemas';

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type VerifyData = z.infer<typeof verifySchema>;
