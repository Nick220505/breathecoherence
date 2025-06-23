import { Order, Prisma } from '@prisma/client';

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
