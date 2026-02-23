import type { OrderStatus, Prisma } from '@/generated/prisma/client';
import type { z } from 'zod';

import type {
  checkoutSchema,
  createOrderSchema,
  orderSchema,
  orderStatusUpdateSchema,
  updateOrderSchema,
} from './schemas';

export type OrderData = z.infer<typeof orderSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderData = z.infer<typeof updateOrderSchema>;
export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface OrderSummary {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  user: {
    email: string;
  };
}

export type OrderDetail = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
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
