import type { Order, OrderStatus, Prisma } from '@prisma/client';
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

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    type?: string;
    imageBase64?: string;
  };
}

export interface OrderWithItems {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  items: OrderItem[];
}

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
