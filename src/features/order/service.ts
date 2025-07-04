import type { OrderStatus } from '@prisma/client';

import { OrderConfirmationEmail } from '@/components/email-templates/order-confirmation-email';
import resend, { COMPANY_NAME, FROM_EMAIL } from '@/lib/email';

import { orderRepository } from './repository';
import type {
  OrderConfirmationEmailData,
  OrderDetail,
  OrderSummary,
  OrderWithItems,
} from './types';

export const orderService = {
  getAll(): Promise<OrderSummary[]> {
    return orderRepository.findMany();
  },

  getAllOrders(): Promise<OrderSummary[]> {
    return orderRepository.findMany();
  },

  getOrdersInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<OrderSummary[]> {
    return orderRepository.findManyInDateRange(startDate, endDate);
  },

  getRecentOrders(limit: number): Promise<OrderSummary[]> {
    return orderRepository.findManyRecent(limit);
  },

  async getDetail(id: string, userId?: string): Promise<OrderDetail | null> {
    if (id.startsWith('guest-')) {
      return orderRepository.findById(id);
    }
    if (!userId) return null;
    return orderRepository.findByIdAndUser(id, userId);
  },

  getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    return orderRepository.findManyByUser(userId);
  },

  getCount(): Promise<number> {
    return orderRepository.count();
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDetail> {
    return orderRepository.updateStatus(id, status);
  },

  async sendOrderConfirmationEmail({
    orderId,
    customerName,
    customerEmail,
    items,
    total,
    shippingAddress,
  }: OrderConfirmationEmailData): Promise<void> {
    const { error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
      to: [customerEmail],
      subject: `Order Confirmation #${orderId}`,
      react: OrderConfirmationEmail({
        orderId,
        customerName,
        items,
        total,
        shippingAddress,
      }),
    });

    if (error) {
      throw new Error('Failed to send order confirmation email');
    }
  },
};
