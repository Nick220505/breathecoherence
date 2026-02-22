'use server';

import { revalidateTag } from 'next/cache';

import { actionClient, actionClientWithLocale } from '@/lib/safe-action';

import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductByIdSchema,
  productSchema,
  productCountSchema,
  productWithCategoryArraySchema,
  productWithCategorySchema,
} from './schemas';
import { productService } from './service';

export const getAllProducts = actionClientWithLocale
  .outputSchema(productWithCategoryArraySchema)
  .action(({ ctx: { locale } }) => {
    return productService.getAll(locale);
  });

export const getProductById = actionClientWithLocale
  .inputSchema(getProductByIdSchema)
  .outputSchema(productWithCategorySchema)
  .action(({ parsedInput: id, ctx: { locale } }) => {
    return productService.getById(id, locale);
  });

export const getProductCount = actionClient
  .outputSchema(productCountSchema)
  .action(() => {
    return productService.getCount();
  });

export const createProduct = actionClientWithLocale
  .inputSchema(createProductSchema)
  .outputSchema(productSchema)
  .action(async ({ parsedInput: data, ctx: { locale } }) => {
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products', 'max');

    return createdProduct;
  });

export const updateProduct = actionClientWithLocale
  .inputSchema(updateProductSchema)
  .outputSchema(productSchema)
  .action(async ({ parsedInput: data, ctx: { locale } }) => {
    const updatedProduct = await productService.update(data.id, data, locale);
    revalidateTag('products', 'max');
    revalidateTag('product', 'max');

    return updatedProduct;
  });

export const deleteProduct = actionClientWithLocale
  .inputSchema(deleteProductSchema)
  .outputSchema(productSchema)
  .action(async ({ parsedInput: id, ctx: { locale } }) => {
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products', 'max');

    return deletedProduct;
  });
