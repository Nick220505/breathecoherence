import { Prisma, type OrderStatus } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const orderRepository = {
  orderSummarySelect: {
    id: true,
    total: true,
    status: true,
    createdAt: true,
    user: { select: { email: true } },
  } as const satisfies Prisma.OrderSelect,

  orderDetailInclude: {
    items: {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    },
  } as const satisfies Prisma.OrderInclude,

  async findMany(limit?: number) {
    return prisma.order.findMany({
      ...(limit && { take: limit }),
      orderBy: { createdAt: 'desc' },
      select: this.orderSummarySelect,
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: this.orderDetailInclude,
    });
  },

  findByIdAndUser(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: this.orderDetailInclude,
    });
  },

  findManyByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: this.orderDetailInclude,
    });
  },

  count() {
    return prisma.order.count();
  },

  async findManyInDateRange(startDate: Date, endDate: Date) {
    return prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
      select: this.orderSummarySelect,
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: this.orderDetailInclude,
    });
  },
};
