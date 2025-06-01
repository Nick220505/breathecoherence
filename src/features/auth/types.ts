import { User } from '@prisma/client';

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role'>;
