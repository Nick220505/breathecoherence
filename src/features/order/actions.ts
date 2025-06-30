'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createServerAction } from 'zsa';

import { withAuthProcedure } from '@/lib/zsa';

import { orderStatusUpdateSchema } from './schemas';
import { orderService } from './service';

export const getUserOrdersWithItems = withAuthProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    return orderService.getAllWithItemsByUser(ctx.user.id);
  });

export const getOrderDetailServer = withAuthProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input, ctx }) => {
    return orderService.getDetail(input.id, ctx.user.id);
  });

export const getAllOrders = withAuthProcedure
  .createServerAction()
  .handler(async () => {
    return orderService.getAll();
  });

export const getOrderCount = createServerAction().handler(async () => {
  return orderService.getCount();
});

export const updateOrderStatus = withAuthProcedure
  .createServerAction()
  .input(orderStatusUpdateSchema)
  .handler(async ({ input }) => {
    const updatedOrder = await orderService.updateStatus(
      input.id,
      input.status,
    );
    revalidateTag('orders');

    return updatedOrder;
  });
