import { translationService } from '@/features/translation/service';
import { categoryTranslationConfig } from '@/features/category/service';

import { productRepository } from './repository';
import { ProductFormData } from './schema';

import type { ProductWithCategory } from './types';
import type { TranslationConfig } from '@/features/translation/types';
import type { Locale } from '@/i18n/routing';
import type { Product } from '@prisma/client';

const productTranslationConfig: TranslationConfig = {
  entityType: 'Product',
  translatableFields: ['name', 'description'],
};

export const productService = {
  async getAll(locale: Locale): Promise<ProductWithCategory[]> {
    const products = await productRepository.findMany();

    return Promise.all(
      products.map(async (product) => {
        const translatedProduct = await translationService.getTranslatedEntity(
          product,
          locale,
          productTranslationConfig,
        );

        const translatedCategory = await translationService.getTranslatedEntity(
          product.category,
          locale,
          categoryTranslationConfig,
        );

        return {
          ...translatedProduct,
          category: translatedCategory,
        };
      }),
    );
  },

  async getByCategory(
    categoryName: string,
    locale: Locale,
  ): Promise<ProductWithCategory[]> {
    const products = await productRepository.findByCategory(categoryName);

    return Promise.all(
      products.map(async (product) => {
        const translatedProduct = await translationService.getTranslatedEntity(
          product,
          locale,
          productTranslationConfig,
        );

        const translatedCategory = await translationService.getTranslatedEntity(
          product.category,
          locale,
          categoryTranslationConfig,
        );

        return {
          ...translatedProduct,
          category: translatedCategory,
        };
      }),
    );
  },

  async getById(id: string, locale: Locale): Promise<ProductWithCategory> {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error(`Product not found by id: ${id}`);
    }

    const translatedProduct = await translationService.getTranslatedEntity(
      product,
      locale,
      productTranslationConfig,
    );

    const translatedCategory = await translationService.getTranslatedEntity(
      product.category,
      locale,
      categoryTranslationConfig,
    );

    return {
      ...translatedProduct,
      category: translatedCategory,
    };
  },

  getCount(): Promise<number> {
    return productRepository.count();
  },

  async create(data: ProductFormData, locale: Locale): Promise<Product> {
    const { categoryId, ...restData } = data;

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      restData,
      locale,
      productTranslationConfig,
    );

    const newProduct = await productRepository.create({
      name: defaultLocaleData.name,
      description: defaultLocaleData.description,
      price: restData.price,
      stock: restData.stock,
      imageBase64: restData.imageBase64,
      category: { connect: { id: categoryId } },
    });

    await translationService.createTranslations(
      newProduct.id,
      restData,
      locale,
      productTranslationConfig,
    );

    return translationService.getTranslatedEntity(
      newProduct,
      locale,
      productTranslationConfig,
    );
  },

  async update(
    id: string,
    data: ProductFormData,
    locale: Locale,
  ): Promise<Product> {
    await this.getById(id, locale);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      productTranslationConfig,
    );

    const updatedProduct = await productRepository.update(id, {
      ...data,
      ...defaultLocaleData,
    });

    await translationService.updateTranslations(
      id,
      data,
      locale,
      productTranslationConfig,
    );

    return translationService.getTranslatedEntity(
      updatedProduct,
      locale,
      productTranslationConfig,
    );
  },

  async delete(id: string, locale: Locale): Promise<Product> {
    const translatedProduct = await this.getById(id, locale);

    await translationService.deleteTranslations(id, productTranslationConfig);

    await productRepository.delete(id);

    return translatedProduct;
  },
};
