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

  create(
    categoryData: Prisma.CategoryCreateInput,
    translations: { locale: string; name: string; description: string }[],
  ) {
    return prisma.$transaction(async (tx) => {
      const newCategory = await tx.category.create({ data: categoryData });
      for (const translation of translations) {
        await tx.categoryTranslation.create({
          data: { ...translation, categoryId: newCategory.id },
        });
      }
      return newCategory;
    });
  },

  update(
    id: string,
    categoryData: Prisma.CategoryUpdateInput,
    translations: { locale: string; name: string; description: string }[],
  ) {
    return prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({
        where: { id },
        data: categoryData,
      });

      for (const translation of translations) {
        await tx.categoryTranslation.upsert({
          where: {
            categoryId_locale: {
              categoryId: updatedCategory.id,
              locale: translation.locale,
            },
          },
          update: {
            name: translation.name,
            description: translation.description,
          },
          create: { ...translation, categoryId: updatedCategory.id },
        });
      }
      return updatedCategory;
    });
  },

  delete: (id: string) => {
    return prisma.category.delete({ where: { id } });
  },

  findTranslation: (categoryId: string, locale: string) => {
    return prisma.categoryTranslation.findUnique({
      where: {
        categoryId_locale: {
          categoryId,
          locale,
        },
      },
    });
  },
};
