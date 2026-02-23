import type { Prisma } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const categoryRepository = {
  findMany() {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  count() {
    return prisma.category.count();
  },

  async hasProducts(categoryId: string) {
    const productCount = await prisma.product.count({
      where: { categoryId },
    });
    return productCount > 0;
  },

  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
