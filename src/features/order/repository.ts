import prisma from '@/lib/prisma';

import type { OrderSummary, OrderDetail } from './types';

export const orderRepository = {
  async findMany(): Promise<OrderSummary[]> {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    });

    return orders.map(({ id, total, status, createdAt, user }) => ({
      id,
      total,
      status,
      createdAt,
      userEmail: user.email,
    }));
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

  findManyWithItemsByUser(userId: string): Promise<OrderDetail[]> {
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

  count(): Promise<number> {
    return prisma.order.count();
  },

  async updateStatus(
    id: string,
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
  ): Promise<OrderDetail> {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
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

    return updatedOrder;
  },
};
