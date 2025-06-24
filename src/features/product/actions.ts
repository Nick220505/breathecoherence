'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';

import { Locale } from '@/i18n/routing';

import { productSchema } from './schema';
import { productService } from './service';

import type { ProductFormData } from './schema';
import type { ProductWithCategory } from './types';
import type { ActionState } from '@/lib/types';
import type { Product } from '@prisma/client';

export async function getAllProducts(): Promise<ProductWithCategory[]> {
  const locale = (await getLocale()) as Locale;

  return productService.getAll(locale);
}

export async function getProductById(id: string): Promise<ProductWithCategory> {
  const locale = (await getLocale()) as Locale;

  try {
    return await productService.getById(id, locale);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Product not found by id')
    ) {
      notFound();
    }

    throw error;
  }
}

export async function createProduct(values: ProductFormData) {
  const t = await getTranslations('ServerActions.Product');

  const { success, data, error } = productSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: t('fillRequiredFields'),
      errors: error.flatten().fieldErrors,
    };
  }

  try {
    const locale = (await getLocale()) as Locale;
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products');

    return {
      success: true,
      message: t('createSuccess'),
      data: createdProduct,
    };
  } catch {
    return { success: false, message: t('createError') };
  }
}

export async function updateProduct(values: ProductFormData) {
  const t = await getTranslations('ServerActions.Product');

  const { success, data, error } = productSchema.safeParse(values);

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
    const updatedProduct = await productService.update(id, data, locale);
    revalidateTag('products');
    revalidateTag('product');

    return {
      success: true,
      message: t('updateSuccess'),
      data: updatedProduct,
    };
  } catch {
    return { success: false, message: t('updateError') };
  }
}

export async function deleteProduct(id: string): Promise<ActionState<Product>> {
  const t = await getTranslations('ServerActions.Product');

  try {
    const locale = (await getLocale()) as Locale;
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products');

    return {
      success: true,
      message: t('deleteSuccess'),
      data: deletedProduct,
    };
  } catch {
    return { success: false, message: t('deleteError') };
  }
}
