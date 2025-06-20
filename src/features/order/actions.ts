'use server';

import { auth } from '@/auth';

import { orderService } from './service';

import type { OrderDetail, OrderSummary } from './types';

export async function getUserOrdersWithItems(): Promise<OrderDetail[]> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return orderService.getAllWithItemsByUser(session.user.id);
}

export async function getOrderDetailServer(
  id: string,
): Promise<OrderDetail | null> {
  const session = await auth();
  return orderService.getDetail(id, session?.user?.id);
}

export async function getAllOrders(): Promise<OrderSummary[]> {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return orderService.getAll();
}
