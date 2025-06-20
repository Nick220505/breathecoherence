import { OrderStatus } from '@prisma/client';

export interface OrderSummary {
  id: string;
  userEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
