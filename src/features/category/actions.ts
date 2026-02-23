'use server';

import { revalidateTag } from 'next/cache';

import { actionClient, actionClientWithLocale } from '@/lib/safe-action';

import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from './schemas';
import { categoryService } from './service';

export const getAllCategories = actionClientWithLocale.action(
  ({ ctx: { locale } }) => categoryService.getAll(locale),
);

export const getCategoryCount = actionClient.action(() =>
  categoryService.getCount(),
);

export const createCategory = actionClientWithLocale
  .inputSchema(createCategorySchema)
  .action(async ({ parsedInput: data, ctx: { locale } }) => {
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories', 'max');
    return createdCategory;
  });

export const updateCategory = actionClientWithLocale
  .inputSchema(updateCategorySchema)
  .action(async ({ parsedInput: { id, ...data }, ctx: { locale } }) => {
    const updatedCategory = await categoryService.update(id, data, locale);
    revalidateTag('categories', 'max');
    revalidateTag('category', 'max');
    return updatedCategory;
  });

export const deleteCategory = actionClientWithLocale
  .inputSchema(deleteCategorySchema)
  .action(async ({ parsedInput: id, ctx: { locale } }) => {
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories', 'max');
    return deletedCategory;
  });
