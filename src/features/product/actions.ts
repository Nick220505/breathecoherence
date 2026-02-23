'use server';

import { revalidateTag } from 'next/cache';

import { actionClient, actionClientWithLocale } from '@/lib/safe-action';

import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductByIdSchema,
} from './schemas';
import { productService } from './service';

export const getAllProducts = actionClientWithLocale.action(
  ({ ctx: { locale } }) => productService.getAll(locale),
);

export const getProductById = actionClientWithLocale
  .inputSchema(getProductByIdSchema)
  .action(({ parsedInput: id, ctx: { locale } }) =>
    productService.getById(id, locale),
  );

export const getProductCount = actionClient.action(() =>
  productService.getCount(),
);

export const createProduct = actionClientWithLocale
  .inputSchema(createProductSchema)
  .action(async ({ parsedInput: data, ctx: { locale } }) => {
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products', 'max');
    return createdProduct;
  });

export const updateProduct = actionClientWithLocale
  .inputSchema(updateProductSchema)
  .action(async ({ parsedInput: { id, ...data }, ctx: { locale } }) => {
    const updatedProduct = await productService.update(id, data, locale);
    revalidateTag('products', 'max');
    revalidateTag('product', 'max');
    return updatedProduct;
  });

export const deleteProduct = actionClientWithLocale
  .inputSchema(deleteProductSchema)
  .action(async ({ parsedInput: id, ctx: { locale } }) => {
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products', 'max');
    return deletedProduct;
  });
