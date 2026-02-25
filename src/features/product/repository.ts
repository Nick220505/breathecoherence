import type { Prisma } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const productRepository = {
  productWithCategoryInclude: {
    category: true,
  } as const satisfies Prisma.ProductInclude,

  findMany() {
    return prisma.product.findMany({
      include: this.productWithCategoryInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findByCategory(categoryName: string) {
    return prisma.product.findMany({
      where: { category: { name: categoryName } },
      include: this.productWithCategoryInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.product.findUniqueOrThrow({
      where: { id },
      include: this.productWithCategoryInclude,
    });
  },

  count() {
    return prisma.product.count();
  },

  async hasOrders(productId: string) {
    const orderItemCount = await prisma.orderItem.count({
      where: { productId },
    });
    return orderItemCount > 0;
  },

  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  },

  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
