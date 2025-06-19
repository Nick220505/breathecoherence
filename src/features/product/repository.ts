import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export const productRepository = {
  findMany: () => {
    return prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findById: (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },

  findTranslation: (productId: string, locale: string) => {
    return prisma.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId,
          locale,
        },
      },
    });
  },

  create(
    productData: Prisma.ProductCreateInput,
    translations: { locale: string; name: string; description: string }[],
  ) {
    return prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({ data: productData });
      for (const t of translations) {
        await tx.productTranslation.create({
          data: { ...t, productId: newProduct.id },
        });
      }
      return newProduct;
    });
  },

  update(
    id: string,
    productData: Prisma.ProductUpdateInput,
    translations: { locale: string; name: string; description: string }[],
  ) {
    return prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: productData,
      });

      for (const t of translations) {
        await tx.productTranslation.upsert({
          where: {
            productId_locale: {
              productId: updatedProduct.id,
              locale: t.locale,
            },
          },
          update: { name: t.name, description: t.description },
          create: { ...t, productId: updatedProduct.id },
        });
      }
      return updatedProduct;
    });
  },

  delete: (id: string) => {
    return prisma.product.delete({ where: { id } });
  },

  async getAll() {
    return prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  },
};
