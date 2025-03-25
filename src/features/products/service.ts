import { Product } from '@prisma/client';

import { productRepository } from './repository';
import { ProductFormData } from './schema';

export const productService = {
  async getAll(): Promise<Product[]> {
    return productRepository.getAll();
  },

  async getById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  async create(data: ProductFormData): Promise<Product> {
    return productRepository.create(data);
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    return productRepository.update(id, data);
  },

  async delete(id: string): Promise<Product> {
    return productRepository.delete(id);
  },
};
