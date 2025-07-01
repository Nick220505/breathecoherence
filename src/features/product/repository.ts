import type { Prisma, Product } from '@prisma/client';

import prisma from '@/lib/prisma';

import type { ProductWithCategory } from './types';

export const productRepository = {
  findMany(): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByCategory(categoryName: string): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { category: { name: categoryName } },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string): Promise<ProductWithCategory | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  count(): Promise<number> {
    return prisma.product.count();
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
