import type { User } from '@/generated/prisma/client';
import { hash } from 'bcryptjs';

import { USER_HAS_ORDERS } from './errors';
import { userRepository } from './repository';
import type { CreateUserData, UpdateUserData, UserSummary } from './schemas';

export const userService = {
  getAll(): Promise<UserSummary[]> {
    return userRepository.findMany();
  },

  getAllUsers(): Promise<UserSummary[]> {
    return userRepository.findMany();
  },

  getRecentUsers(limit: number): Promise<UserSummary[]> {
    return userRepository.findManyRecent(limit);
  },

  getCount(): Promise<number> {
    return userRepository.count();
  },

  async create(data: CreateUserData): Promise<User> {
    const hashedPassword = await hash(data.password, 12);
    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  update(id: string, data: UpdateUserData): Promise<User> {
    return userRepository.update(id, data);
  },

  async delete(id: string): Promise<User> {
    const hasOrders = await userRepository.hasOrders(id);

    if (hasOrders) {
      throw new Error(USER_HAS_ORDERS);
    }

    return userRepository.delete(id);
  },
};
