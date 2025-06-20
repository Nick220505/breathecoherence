'use server';

import { orderService } from './service';

import type { OrderSummary } from './types';

export async function getAllOrders(): Promise<OrderSummary[]> {
  return orderService.getAll();
}
