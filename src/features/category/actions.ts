'use server';

import { revalidateTag } from 'next/cache';
import { createServerAction } from 'zsa';

import { withLocaleProcedure } from '@/lib/zsa';

import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  categorySchema,
  categoryArraySchema,
  categoryCountSchema,
} from './schemas';
import { categoryService } from './service';

export const getAllCategories = withLocaleProcedure
  .createServerAction()
  .output(categoryArraySchema)
  .handler(async ({ ctx: { locale } }) => {
    return categoryService.getAll(locale);
  });

export const getCategoryCount = createServerAction()
  .output(categoryCountSchema)
  .handler(async () => {
    return categoryService.getCount();
  });

export const createCategory = withLocaleProcedure
  .createServerAction()
  .input(createCategorySchema)
  .output(categorySchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories', 'max');

    return createdCategory;
  });

export const updateCategory = withLocaleProcedure
  .createServerAction()
  .input(updateCategorySchema)
  .output(categorySchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const updatedCategory = await categoryService.update(data.id, data, locale);
    revalidateTag('categories', 'max');
    revalidateTag('category', 'max');

    return updatedCategory;
  });

export const deleteCategory = withLocaleProcedure
  .createServerAction()
  .input(deleteCategorySchema)
  .output(categorySchema)
  .handler(async ({ input: id, ctx: { locale } }) => {
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories', 'max');

    return deletedCategory;
  });
