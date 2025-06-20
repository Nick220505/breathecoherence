'use server';

import { revalidateTag } from 'next/cache';
import { getTranslations, getLocale } from 'next-intl/server';

import { Locale } from '@/i18n/routing';

import { categorySchema } from './schema';
import { categoryService } from './service';

import type { ActionState } from '@/lib/types/action';
import type { FormState } from '@/lib/types/form';
import type { Category } from '@prisma/client';

export async function getAllCategories(): Promise<Category[]> {
  const locale = (await getLocale()) as Locale;
  return categoryService.getAll(locale);
}

export async function createCategory(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Category>> {
  const t = await getTranslations('ServerActions.Category');
  const rawData = Object.fromEntries(formData.entries());

  const { success, data, error } = categorySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const locale = (await getLocale()) as Locale;
    const createdCategory = await categoryService.create(data, locale);
    revalidateTag('categories');

    return {
      errors: {},
      message: t('createSuccess'),
      success: true,
      data: createdCategory,
    };
  } catch {
    return {
      success: false,
      message: t('createError'),
      errors: {},
    };
  }
}

export async function updateCategory(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Category>> {
  const t = await getTranslations('ServerActions.Category');
  const rawData = Object.fromEntries(formData.entries());

  const { success, data, error } = categorySchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  const { id } = data;
  if (!id) {
    return {
      success: false,
      message: t('missingId'),
      errors: {},
    };
  }

  try {
    const locale = (await getLocale()) as Locale;
    const updatedCategory = await categoryService.update(id, data, locale);
    revalidateTag('categories');

    return {
      errors: {},
      message: t('updateSuccess'),
      success: true,
      data: updatedCategory,
    };
  } catch {
    return {
      success: false,
      message: t('updateError'),
      errors: {},
    };
  }
}

export async function deleteCategory(
  id: string,
): Promise<ActionState<Category>> {
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
    return {
      success: false,
      message: t('deleteError'),
    };
  }
}
