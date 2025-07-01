'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { z } from 'zod';
import { createServerAction } from 'zsa';

import type { Locale } from '@/i18n/routing';
import { withLocaleProcedure } from '@/lib/zsa';

import { createProductSchema, updateProductSchema } from './schemas';
import { productService } from './service';
import type { ProductWithCategory } from './types';

export const getAllProducts = withLocaleProcedure
  .createServerAction()
  .handler(async ({ ctx: { locale } }) => {
    return productService.getAll(locale);
  });

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

export const getProductCount = createServerAction().handler(async () => {
  return productService.getCount();
});

export const createProduct = withLocaleProcedure
  .createServerAction()
  .input(createProductSchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products');

    return createdProduct;
  });

export const updateProduct = withLocaleProcedure
  .createServerAction()
  .input(updateProductSchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const updatedProduct = await productService.update(data.id, data, locale);
    revalidateTag('products');
    revalidateTag('product');

    return updatedProduct;
  });

export const deleteProduct = withLocaleProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id }, ctx: { locale } }) => {
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products');

    return deletedProduct;
  });
