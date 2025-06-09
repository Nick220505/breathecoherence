'use server';

import { Product } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getLocale, getTranslations } from 'next-intl/server';

import { Locale } from '@/i18n/routing';
import { ActionState } from '@/lib/types/action';
import { FormState } from '@/lib/types/form';

import { productSchema } from './schema';
import { productService } from './service';

export async function getAllProducts(): Promise<Product[]> {
  const locale = (await getLocale()) as Locale;
  return productService.getAll(locale);
}

export async function getProductById(id: string): Promise<Product | null> {
  const locale = (await getLocale()) as Locale;
  return productService.getById(id, locale);
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const t = await getTranslations('ServerActions.Product');
  const locale = (await getLocale()) as Locale;
  const rawData = Object.fromEntries(formData.entries());

  const { success, data, error } = productSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: t('fillRequiredFields'),
      success: false,
    };
  }

  try {
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products');

    return {
      errors: {},
      message: t('createSuccess'),
      success: true,
      data: createdProduct,
    };
  } catch {
    return {
      success: false,
      message: t('createError'),
      errors: {},
    };
  }
}

export async function updateProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const t = await getTranslations('ServerActions.Product');
  const locale = (await getLocale()) as Locale;
  const rawData = Object.fromEntries(formData.entries());

  const { success, data, error } = productSchema.safeParse(rawData);

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
    const updatedProduct = await productService.update(id, data, locale);
    revalidateTag('products');
    revalidateTag('product');

    return {
      errors: {},
      message: t('updateSuccess'),
      success: true,
      data: updatedProduct,
    };
  } catch {
    return {
      success: false,
      message: t('updateError'),
      errors: {},
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionState<Product>> {
  const t = await getTranslations('ServerActions.Product');
  const locale = (await getLocale()) as Locale;
  try {
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products');
    return {
      success: true,
      message: t('deleteSuccess'),
      data: deletedProduct,
    };
  } catch {
    return {
      success: false,
      message: t('deleteError'),
    };
  }
}
