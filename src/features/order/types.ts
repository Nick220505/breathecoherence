import type { Prisma } from '@/generated/prisma/client';
import type { z } from 'zod';

import type {
  checkoutSchema,
  createOrderSchema,
  orderSchema,
  orderStatusUpdateSchema,
  updateOrderSchema,
} from './schemas';

export type Order = z.infer<typeof orderSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
export type Checkout = z.infer<typeof checkoutSchema>;

export type OrderSummary = Prisma.OrderGetPayload<{
  select: {
    id: true;
    total: true;
    status: true;
    createdAt: true;
    user: { select: { email: true } };
  };
}>;

export type OrderDetail = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            category: true;
          };
        };
      };
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

export interface OrderDetails {
  orderId: string;
  status: string;
  amount: number;
  paymentIntentId: string;
}
