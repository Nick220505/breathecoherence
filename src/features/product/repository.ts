import type { Prisma, Product } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

import type { ProductWithCategory } from './schemas';

export const productRepository = {
  productWithCategoryInclude: {
    category: true,
  } as const satisfies Prisma.ProductInclude,

  findMany(): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      include: this.productWithCategoryInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findByCategory(categoryName: string): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { category: { name: categoryName } },
      include: this.productWithCategoryInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string): Promise<ProductWithCategory | null> {
    return prisma.product.findUnique({
      where: { id },
      include: this.productWithCategoryInclude,
    });
  },

  count(): Promise<number> {
    return prisma.product.count();
  },

  async hasOrders(productId: string): Promise<boolean> {
    const orderItemCount = await prisma.orderItem.count({
      where: { productId },
    });
    return orderItemCount > 0;
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
