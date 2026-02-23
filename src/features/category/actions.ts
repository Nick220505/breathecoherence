'use server';

import { revalidateTag } from 'next/cache';

import { actionClient, actionClientWithLocale } from '@/lib/safe-action';

import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  categorySchema,
  categoryArraySchema,
  categoryCountSchema,
} from './schemas';
import { categoryService } from './service';

export const getAllCategories = actionClientWithLocale
  .outputSchema(categoryArraySchema)
  .action(({ ctx: { locale } }) => categoryService.getAll(locale));

export const getCategoryCount = actionClient
  .outputSchema(categoryCountSchema)
  .action(() => categoryService.getCount());

export const createCategory = actionClientWithLocale
  .inputSchema(createCategorySchema)
  .outputSchema(categorySchema)
  .action(async ({ parsedInput: data, ctx: { locale } }) => {
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories', 'max');
    return createdCategory;
  });

export const updateCategory = actionClientWithLocale
  .inputSchema(updateCategorySchema)
  .outputSchema(categorySchema)
  .action(async ({ parsedInput: { id, ...data }, ctx: { locale } }) => {
    const updatedCategory = await categoryService.update(id, data, locale);
    revalidateTag('categories', 'max');
    revalidateTag('category', 'max');
    return updatedCategory;
  });

export const deleteCategory = actionClientWithLocale
  .inputSchema(deleteCategorySchema)
  .outputSchema(categorySchema)
  .action(async ({ parsedInput: id, ctx: { locale } }) => {
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories', 'max');
    return deletedCategory;
  });
