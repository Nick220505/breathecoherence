import type { Category, Prisma } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const categoryRepository = {
  findMany(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  },

  count(): Promise<number> {
    return prisma.category.count();
  },

  async hasProducts(categoryId: string): Promise<boolean> {
    const productCount = await prisma.product.count({
      where: { categoryId },
    });
    return productCount > 0;
  },

  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  },

  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  },
};
