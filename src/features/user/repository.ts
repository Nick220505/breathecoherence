import type { Prisma, User } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

import type { UserSummary } from './schemas';

export const userRepository = {
  userSummarySelect: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  } as const satisfies Prisma.UserSelect,

  findMany(limit?: number): Promise<UserSummary[]> {
    return prisma.user.findMany({
      ...(limit && { take: limit }),
      orderBy: { createdAt: 'desc' },
      select: this.userSummarySelect,
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

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findByEmailAndVerifyToken(
    email: string,
    verifyToken: string,
  ): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
        verifyToken,
        verifyTokenExpiry: { gt: new Date() },
      },
    });
  },

  create(data: Prisma.UserCreateInput): Promise<UserSummary> {
    return prisma.user.create({
      data,
      select: this.userSummarySelect,
    });
  },

  update(id: string, data: Prisma.UserUpdateInput): Promise<UserSummary> {
    return prisma.user.update({
      where: { id },
      data,
      select: this.userSummarySelect,
    });
  },

  delete(id: string): Promise<UserSummary> {
    return prisma.user.delete({
      where: { id },
      select: this.userSummarySelect,
    });
  },
};
