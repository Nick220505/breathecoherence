import { Category, CategoryTranslation, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export const categoryRepository = {
  findMany(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  },

  create(
    data: Prisma.CategoryCreateInput,
    translations: { locale: string; name: string; description: string }[],
  ): Promise<Category> {
    return prisma.$transaction(async (tx) => {
      const newCategory = await tx.category.create({ data });
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
    data: Prisma.CategoryUpdateInput,
    translations: { locale: string; name: string; description: string }[],
  ): Promise<Category> {
    return prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({ where: { id }, data });
      for (const { locale, name, description } of translations) {
        await tx.categoryTranslation.upsert({
          where: {
            categoryId_locale: { categoryId: updatedCategory.id, locale },
          },
          update: { name, description },
          create: { locale, name, description, categoryId: updatedCategory.id },
        });
      }
      return updatedCategory;
    });
  },

  delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  },

  findTranslation(
    categoryId: string,
    locale: string,
  ): Promise<CategoryTranslation | null> {
    return prisma.categoryTranslation.findUnique({
      where: { categoryId_locale: { categoryId, locale } },
    });
  },
};
