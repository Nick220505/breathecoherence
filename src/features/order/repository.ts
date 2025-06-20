import prisma from '@/lib/prisma';

import type { OrderSummary } from './types';

export const orderRepository = {
  async findMany(): Promise<OrderSummary[]> {
    return prisma.order
      .findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      })
      .then((orders) =>
        orders.map((o) => ({
          id: o.id,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt,
          userEmail: o.user.email,
        })),
      );
  },
};
