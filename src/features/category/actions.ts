'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';

import { categorySchema } from './schema';
import { categoryService } from './service';
import { createServerAction } from 'zsa';

import type { Locale } from '@/i18n/routing';
import type { Category } from '@prisma/client';

export async function getAllCategories(): Promise<Category[]> {
  const locale = (await getLocale()) as Locale;

  return categoryService.getAll(locale);
}

export async function getCategoryById(id: string): Promise<Category> {
  const locale = (await getLocale()) as Locale;

  try {
    return await categoryService.getById(id, locale);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Category not found by id')
    ) {
      notFound();
    }

    throw error;
  }
}

export async function getCategoryCount(): Promise<number> {
  return categoryService.getCount();
}

export const createCategory = createServerAction()
  .input(categorySchema)
  .handler(async ({ input: data }) => {
    const locale = (await getLocale()) as Locale;
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories');

    return createdCategory;
  });

export const updateCategory = createServerAction()
  .input(categorySchema)
  .handler(async ({ input: data }) => {
    const locale = (await getLocale()) as Locale;
    const updatedCategory = await categoryService.update(
      data.id!,
      data,
      locale,
    );
    revalidateTag('categories');
    revalidateTag('category');

    return updatedCategory;
  });

const deleteCategorySchema = z.object({
  id: z.string().min(1),
});

export const deleteCategory = createServerAction()
  .input(deleteCategorySchema)
  .handler(async ({ input: { id } }) => {
    const locale = (await getLocale()) as Locale;
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories');

    return deletedCategory;
  });
