import { userRepository } from './repository';

import type { UserFormData } from './schema';
import type { UserSummary } from './types';
import type { Prisma, User } from '@prisma/client';

export const userService = {
  getAll(): Promise<UserSummary[]> {
    return userRepository.findMany();
  },

  getCount(): Promise<number> {
    return userRepository.count();
  },

  create(data: UserFormData): Promise<User> {
    return userRepository.create(data as Prisma.UserCreateInput);
  },

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return userRepository.update(id, data);
  },

  delete(id: string): Promise<User> {
    return userRepository.delete(id);
  },
};
