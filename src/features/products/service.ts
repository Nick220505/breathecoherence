import { Prisma, Product } from '@prisma/client';

import { productRepository } from './repository';

export const productService = {
  getAll(): Promise<Product[]> {
    return productRepository.getAll();
  },

  getById(id: string): Promise<Product | null> {
    return productRepository.getById(id);
  },

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return productRepository.create(data);
  },

  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return productRepository.update(id, data);
  },

  delete(id: string): Promise<Product> {
    return productRepository.delete(id);
  },
};
