'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

import { categorySchema } from './schema';
import { categoryService } from './service';

import type { CategoryFormData } from './schema';
import type { Locale } from '@/i18n/routing';
import type { ActionResult } from '@/lib/types';
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

export async function createCategory(
  values: CategoryFormData,
): Promise<ActionResult<Category>> {
  const t = await getTranslations('ServerActions.Category');

  const { success, data, error } = categorySchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const locale = (await getLocale()) as Locale;
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories');

    return {
      success: true,
      message: t('createSuccess'),
      data: createdCategory,
    };
  } catch {
    return { success: false, message: t('createError') };
  }
}

export async function updateCategory(
  values: CategoryFormData,
): Promise<ActionResult<Category>> {
  const t = await getTranslations('ServerActions.Category');

  const { success, data, error } = categorySchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  const { id } = data;
  if (!id) {
    return { success: false, message: t('missingId') };
  }

  try {
    const locale = (await getLocale()) as Locale;
    const updatedCategory = await categoryService.update(id, data, locale);
    revalidateTag('categories');
    revalidateTag('category');

    return {
      success: true,
      message: t('updateSuccess'),
      data: updatedCategory,
    };
  } catch {
    return { success: false, message: t('updateError') };
  }
}

export async function deleteCategory(
  id: string,
): Promise<ActionResult<Category>> {
  const t = await getTranslations('ServerActions.Category');

  try {
    const locale = (await getLocale()) as Locale;
    const deletedCategory = await categoryService.delete(id, locale);
    revalidateTag('categories');

    return {
      success: true,
      message: t('deleteSuccess'),
      data: deletedCategory,
    };
  } catch {
    return { success: false, message: t('deleteError') };
  }
}
