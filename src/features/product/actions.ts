'use server';

import { Product } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { getLocale, getTranslations } from 'next-intl/server';

import { ActionState } from '@/lib/types/action';
import { FormState } from '@/lib/types/form';

import { productSchema } from './schema';
import { productService } from './service';

export async function getAllProducts(): Promise<Product[]> {
  const locale = await getLocale();
  return productService.getAll(locale);
}

export async function getProductById(id: string): Promise<Product | null> {
  const locale = await getLocale();
  return productService.getById(id, locale);
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const t = await getTranslations('ServerActions.Product');
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
    const createdProduct = await productService.create(data);
    revalidateTag('products');

    return {
      errors: {},
      message: t('createSuccess'),
      success: true,
      data: createdProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message: error instanceof Error ? error.message : t('createError'),
      success: false,
    };
  }
}

export async function updateProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const t = await getTranslations('ServerActions.Product');
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
      errors: {},
      message: t('missingId'),
      success: false,
    };
  }

  try {
    const updatedProduct = await productService.update(id, data);
    revalidateTag('products');
    revalidateTag('product');

    return {
      errors: {},
      message: t('updateSuccess'),
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message: error instanceof Error ? error.message : t('updateError'),
      success: false,
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionState<Product>> {
  const t = await getTranslations('ServerActions.Product');
  try {
    const deletedProduct = await productService.delete(id);
    revalidateTag('products');
    revalidateTag('product');
    return {
      success: true,
      message: t('deleteSuccess'),
      data: deletedProduct,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : t('deleteError'),
    };
  }
}
