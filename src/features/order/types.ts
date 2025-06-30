import type { Order, Prisma } from '@prisma/client';
import type { z } from 'zod';

import type {
  orderSchema,
  createOrderSchema,
  updateOrderSchema,
  orderStatusUpdateSchema,
} from './schemas';

export type OrderFormData = z.infer<typeof orderSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type OrderStatusUpdateFormData = z.infer<typeof orderStatusUpdateSchema>;

export interface OrderSummary
  extends Pick<Order, 'id' | 'total' | 'status' | 'createdAt'> {
  userEmail: string;
}

export type OrderDetail = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;

export interface EmailOrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderConfirmationEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: EmailOrderItem[];
  total: number;
  shippingAddress?: ShippingAddress;
}
