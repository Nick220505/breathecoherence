import type { OrderStatus } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

import type { OrderDetail, OrderSummary, OrderWithItems } from './types';

export const orderRepository = {
  async findMany(limit?: number): Promise<OrderSummary[]> {
    const orders = await prisma.order.findMany({
      ...(limit && { take: limit }),
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

  async findManyByUser(userId: string): Promise<OrderWithItems[]> {
    const orders = await prisma.order.findMany({
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

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
          type: (item.product as { type?: string }).type,
          imageBase64: item.product.imageBase64 ?? undefined,
        },
      })),
    }));
  },

  count(): Promise<number> {
    return prisma.order.count();
  },

  async findManyInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<OrderSummary[]> {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
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

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDetail> {
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
