import { Prisma, User } from '@prisma/client';

import prisma from '@/lib/prisma';

import type { UserSummary } from './types';

export const userRepository = {
  async findMany(): Promise<UserSummary[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  },

  create(userData: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data: userData });
  },

  update(id: string, userData: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data: userData });
  },

  delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  },
};
