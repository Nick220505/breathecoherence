import { orderRepository } from './repository';

import type { OrderSummary } from './types';

export const orderService = {
  async getAll(): Promise<OrderSummary[]> {
    return orderRepository.findMany();
  },
};
