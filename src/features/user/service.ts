import { userRepository } from './repository';

import type { UserFormData } from './schema';
import type { UserSummary } from './types';
import type { Prisma, User } from '@prisma/client';

export const userService = {
  async getAll(): Promise<UserSummary[]> {
    return userRepository.findMany();
  },

  async create(data: UserFormData): Promise<User> {
    return userRepository.create(data as Prisma.UserCreateInput);
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return userRepository.update(id, data);
  },

  async delete(id: string): Promise<User> {
    return userRepository.delete(id);
  },
};
