import prisma from '@/lib/prisma';
import { Product } from '@/prisma/generated';

import { ProductFormData } from './schema';

export const productRepository = {
  getAll(): Promise<Product[]> {
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  },

  getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  },

  create(data: ProductFormData): Promise<Product> {
    return prisma.product.create({ data });
  },

  update(id: string, data: ProductFormData): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
