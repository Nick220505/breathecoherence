'use server';

import { Product } from '@prisma/client';
import { revalidateTag } from 'next/cache';

import { ActionState } from '@/lib/types/action';
import { FormState } from '@/lib/types/form';

import { productSchema } from './schema';
import { productService } from './service';

export async function getAllProducts(): Promise<Product[]> {
  return productService.getAll();
}

export async function getProductById(id: string): Promise<Product | null> {
  return productService.getById(id);
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = productSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: 'Please fill in all required fields and ensure they are valid',
      success: false,
    };
  }

  try {
    const productDataToCreate = {
      ...data,
      imageBase64: data.imageBase64 ?? null,
    };
    const createdProduct = await productService.create(productDataToCreate);
    revalidateTag('products');

    return {
      errors: {},
      message: 'Product created successfully',
      success: true,
      data: createdProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : 'Failed to create product',
      success: false,
    };
  }
}

export async function updateProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState<Product>> {
  const rawData = Object.fromEntries(formData.entries());
  const { success, data, error } = productSchema.safeParse(rawData);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      message: 'Please fill in all required fields and ensure they are valid',
      success: false,
    };
  }

  if (!data.id) {
    return {
      errors: {},
      message: 'Product ID is missing',
      success: false,
    };
  }

  try {
    const productDataToUpdate = {
      ...data,
      imageBase64: data.imageBase64 ?? null,
    };
    const updatedProduct = await productService.update(
      data.id,
      productDataToUpdate,
    );
    revalidateTag('products');
    revalidateTag('product');

    return {
      errors: {},
      message: 'Product updated successfully',
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : 'Failed to update product',
      success: false,
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionState<Product>> {
  try {
    const deletedProduct = await productService.delete(id);
    revalidateTag('products');
    revalidateTag('product');
    return {
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete product',
    };
  }
}
