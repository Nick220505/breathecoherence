import type { z } from 'zod';

import type {
  createUserSchema,
  updateUserSchema,
  userSchema,
  userSummarySchema,
} from './schemas';

export type UserData = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UserSummary = z.infer<typeof userSummarySchema>;
