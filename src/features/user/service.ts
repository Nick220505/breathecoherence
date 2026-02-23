import { hash } from 'bcryptjs';

import { USER_HAS_ORDERS } from './errors';
import { userRepository } from './repository';
import type { CreateUserData, UpdateUserData, UserSummary } from './schemas';

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

  async create(data: CreateUserData): Promise<UserSummary> {
    const hashedPassword = await hash(data.password, 12);
    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  update(id: string, data: Omit<UpdateUserData, 'id'>): Promise<UserSummary> {
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
