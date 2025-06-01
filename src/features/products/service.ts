import { Prisma, Product } from '@prisma/client';

import prisma from '@/lib/prisma';

export const productService = {
  getAll(): Promise<Product[]> {
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  },

  getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  },

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  },

  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
