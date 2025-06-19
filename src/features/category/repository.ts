import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export const categoryRepository = {
  findMany: () => {
    return prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findById: (id: string) => {
    return prisma.category.findUnique({ where: { id } });
  },

  create(categoryData: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data: categoryData });
  },

  update(id: string, categoryData: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data: categoryData,
    });
  },

  delete: (id: string) => {
    return prisma.category.delete({ where: { id } });
  },
};
