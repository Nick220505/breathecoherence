'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createServerAction } from 'zsa';

import { withLocaleProcedure } from '@/lib/zsa';

import { createCategorySchema, updateCategorySchema } from './schemas';
import { categoryService } from './service';

export const getAllCategories = withLocaleProcedure
  .createServerAction()
  .handler(async ({ ctx: { locale } }) => {
    return categoryService.getAll(locale);
  });

export const getCategoryCount = createServerAction().handler(async () => {
  return categoryService.getCount();
});

export const createCategory = withLocaleProcedure
  .createServerAction()
  .input(createCategorySchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories');

    return createdCategory;
  });

export const updateCategory = withLocaleProcedure
  .createServerAction()
  .input(updateCategorySchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const updatedCategory = await categoryService.update(data.id, data, locale);
    revalidateTag('categories');
    revalidateTag('category');

    return updatedCategory;
  });

export const deleteCategory = withLocaleProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id }, ctx: { locale } }) => {
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories');

    return deletedCategory;
  });
