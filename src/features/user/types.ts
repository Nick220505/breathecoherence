import type { Role } from '@prisma/client';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
