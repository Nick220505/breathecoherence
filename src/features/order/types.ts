import { OrderStatus, Prisma } from '@prisma/client';

export interface OrderSummary {
  id: string;
  userEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export type OrderDetail = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;
