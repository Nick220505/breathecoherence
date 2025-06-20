'use server';

import { auth } from '@/auth';

import { orderService } from './service';

import type { OrderSummary, OrderDetail } from './types';

export async function getUserOrders(): Promise<OrderSummary[]> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return orderService.getAll();
}

export async function getOrderDetail(id: string): Promise<OrderDetail | null> {
  const session = await auth();
  return orderService.getDetail(id, session?.user?.id);
}
