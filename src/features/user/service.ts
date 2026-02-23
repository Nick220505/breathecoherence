import { hash } from 'bcryptjs';

import { USER_HAS_ORDERS } from './errors';
import { userRepository } from './repository';
import type { CreateUser, UpdateUser, UserSummary } from './schemas';

export const userService = {
  getAll(limit?: number): Promise<UserSummary[]> {
    return userRepository.findMany(limit);
  },

  getCount(): Promise<number> {
    return userRepository.count();
  },

  findByEmail(email: string) {
    return userRepository.findByEmail(email);
  },

  findByEmailAndVerifyToken(email: string, verifyToken: string) {
    return userRepository.findByEmailAndVerifyToken(email, verifyToken);
  },

  async create(data: CreateUser): Promise<UserSummary> {
    return userRepository.create({
      ...data,
      password: await hash(data.password, 12),
    });
  },

  update(id: string, data: Omit<UpdateUser, 'id'>): Promise<UserSummary> {
    return userRepository.update(id, data);
  },

  async delete(id: string): Promise<UserSummary> {
    const hasOrders = await userRepository.hasOrders(id);

    if (hasOrders) {
      throw new Error(USER_HAS_ORDERS);
    }

    return userRepository.delete(id);
  },
};
