'use server';

import { revalidateTag } from 'next/cache';
import { createServerAction } from 'zsa';

import { withLocaleProcedure } from '@/lib/zsa';

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

export const getAllProducts = withLocaleProcedure
  .createServerAction()
  .output(productWithCategoryArraySchema)
  .handler(async ({ ctx: { locale } }) => {
    return productService.getAll(locale);
  });

export const getProductById = withLocaleProcedure
  .createServerAction()
  .input(getProductByIdSchema)
  .output(productWithCategorySchema)
  .handler(async ({ input: id, ctx: { locale } }) => {
    return productService.getById(id, locale);
  });

export const getProductCount = createServerAction()
  .output(productCountSchema)
  .handler(async () => {
    return productService.getCount();
  });

export const createProduct = withLocaleProcedure
  .createServerAction()
  .input(createProductSchema)
  .output(productSchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const createdProduct = await productService.create(data, locale);
    revalidateTag('products');

    return createdProduct;
  });

export const updateProduct = withLocaleProcedure
  .createServerAction()
  .input(updateProductSchema)
  .output(productSchema)
  .handler(async ({ input: data, ctx: { locale } }) => {
    const updatedProduct = await productService.update(data.id, data, locale);
    revalidateTag('products');
    revalidateTag('product');

    return updatedProduct;
  });

export const deleteProduct = withLocaleProcedure
  .createServerAction()
  .input(deleteProductSchema)
  .output(productSchema)
  .handler(async ({ input: id, ctx: { locale } }) => {
    const deletedProduct = await productService.delete(id, locale);
    revalidateTag('products');

    return deletedProduct;
  });
