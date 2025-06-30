import { hash } from 'bcryptjs';

import { userRepository } from './repository';

import type { CreateUserData, UpdateUserData, UserSummary } from './types';
import type { User } from '@prisma/client';

export const userService = {
  getAll(): Promise<UserSummary[]> {
    return userRepository.findMany();
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

  delete(id: string): Promise<User> {
    return userRepository.delete(id);
  },
};
