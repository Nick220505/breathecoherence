import type { Prisma } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const userRepository = {
  userSummarySelect: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  } as const satisfies Prisma.UserSelect,

  findMany(limit?: number) {
    return prisma.user.findMany({
      ...(limit && { take: limit }),
      orderBy: { createdAt: 'desc' },
      select: this.userSummarySelect,
    });
  },

  count() {
    return prisma.user.count();
  },

  async hasOrders(userId: string) {
    const orderCount = await prisma.order.count({
      where: { userId },
    });
    return orderCount > 0;
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByEmailAndVerifyToken(email: string, verifyToken: string) {
    return prisma.user.findUnique({
      where: {
        email,
        verifyToken,
        verifyTokenExpiry: { gt: new Date() },
      },
    });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: this.userSummarySelect,
    });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: this.userSummarySelect,
    });
  },

  delete(id: string) {
    return prisma.user.delete({
      where: { id },
      select: this.userSummarySelect,
    });
  },
};
