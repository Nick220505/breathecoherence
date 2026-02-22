'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { actionClient, actionClientWithAuth } from '@/lib/safe-action';

import { orderStatusUpdateSchema } from './schemas';
import { orderService } from './service';

export const getOrdersByUser = actionClientWithAuth.action(
  ({ ctx: { user } }) => {
    return orderService.getOrdersByUser(user.id);
  },
);

export const getOrderDetail = actionClientWithAuth
  .inputSchema(z.object({ id: z.string() }))
  .action(({ parsedInput: { id }, ctx: { user } }) => {
    return orderService.getDetail(id, user.id);
  });

export const getAllOrders = actionClientWithAuth.action(() => {
  return orderService.getAll();
});

export const getOrderCount = actionClient.action(() => {
  return orderService.getCount();
});

export const updateOrderStatus = actionClientWithAuth
  .inputSchema(orderStatusUpdateSchema)
  .action(async ({ parsedInput: { id, status } }) => {
    const updatedOrder = await orderService.updateStatus(id, status);
    revalidateTag('orders', 'max');

    return updatedOrder;
  });
