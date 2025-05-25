import prisma from '@/lib/prisma';
import { Product } from '@/prisma/generated';

import { ProductFormData } from './schema';

export const productRepository = {
  async getAll(): Promise<Product[]> {
    return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async getById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({ where: { id } });
  },

  async create(data: ProductFormData): Promise<Product> {
    return await prisma.product.create({ data });
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    return await prisma.product.update({ where: { id }, data });
  },

  async delete(id: string): Promise<Product> {
    return await prisma.product.delete({ where: { id } });
  },
};
