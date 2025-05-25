import { Product } from '@prisma/client';

import { productRepository } from './repository';
import { ProductFormData } from './schema';

export const productService = {
  getAll(): Promise<Product[]> {
    return productRepository.getAll();
  },

  getById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  create(data: ProductFormData): Promise<Product> {
    return productRepository.create(data);
  },

  update(id: string, data: ProductFormData): Promise<Product> {
    return productRepository.update(id, data);
  },

  delete(id: string): Promise<Product> {
    return productRepository.delete(id);
  },
};
