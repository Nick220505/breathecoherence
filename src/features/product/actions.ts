'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createServerAction } from 'zsa';

import { withLocaleProcedure } from '@/lib/zsa';

import { createProductSchema, updateProductSchema } from './schemas';
import { productService } from './service';

export const getAllProducts = withLocaleProcedure
  .createServerAction()
  .handler(async ({ ctx: { locale } }) => {
    return productService.getAll(locale);
  });

export const getProductById = withLocaleProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id }, ctx: { locale } }) => {
    return productService.getById(id, locale);
  });

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
