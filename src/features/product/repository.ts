import { Prisma, Product, ProductTranslation } from '@prisma/client';

import prisma from '@/lib/prisma';

import type { ProductWithCategory } from './types';

export const productRepository = {
  findMany(): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
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

  findTranslation(
    productId: string,
    locale: string,
  ): Promise<ProductTranslation | null> {
    return prisma.productTranslation.findUnique({
      where: { productId_locale: { productId, locale } },
    });
  },

  create(
    data: Prisma.ProductCreateInput,
    translations: { locale: string; name: string; description: string }[],
  ): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({ data });
      for (const translation of translations) {
        await tx.productTranslation.create({
          data: { ...translation, productId: newProduct.id },
        });
      }
      return newProduct;
    });
  },

  update(
    id: string,
    data: Prisma.ProductUpdateInput,
    translations: { locale: string; name: string; description: string }[],
  ): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({ where: { id }, data });
      for (const { locale, name, description } of translations) {
        await tx.productTranslation.upsert({
          where: { productId_locale: { productId: updatedProduct.id, locale } },
          update: { name, description },
          create: { locale, name, description, productId: updatedProduct.id },
        });
      }
      return updatedProduct;
    });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
