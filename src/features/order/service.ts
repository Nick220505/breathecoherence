import { orderRepository } from './repository';

import type { OrderSummary, OrderDetail } from './types';

export const orderService = {
  async getAll(): Promise<OrderSummary[]> {
    return orderRepository.findMany();
  },

  async getDetail(id: string, userId?: string): Promise<OrderDetail | null> {
    if (id.startsWith('guest-')) {
      return orderRepository.findById(id);
    }
    if (!userId) return null;
    return orderRepository.findByIdAndUser(id, userId);
  },
};
