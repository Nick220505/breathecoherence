import prisma from '@/lib/prisma';

import type { OrderSummary, OrderDetail } from './types';

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

  findById(id: string): Promise<OrderDetail | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  },

  findByIdAndUser(id: string, userId: string): Promise<OrderDetail | null> {
    return prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  },

  async findManyByUser(userId: string): Promise<OrderSummary[]> {
    return prisma.order
      .findMany({
        where: { userId },
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

  async findManyWithItemsByUser(userId: string): Promise<OrderDetail[]> {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  },
};
