import type { Prisma, User } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

import type { UserSummary } from './schemas';

export const userRepository = {
  findMany(): Promise<UserSummary[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findManyRecent(limit: number): Promise<UserSummary[]> {
    return prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  count(): Promise<number> {
    return prisma.user.count();
  },

  async hasOrders(userId: string): Promise<boolean> {
    const orderCount = await prisma.order.count({
      where: { userId },
    });
    return orderCount > 0;
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  },
};
