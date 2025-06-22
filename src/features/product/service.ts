import { Prisma, Product } from '@prisma/client';

import { translationService } from '@/features/translation/service';
import { TranslationConfig } from '@/features/translation/types';
import { Locale } from '@/i18n/routing';

import { productRepository } from './repository';
import { ProductFormData } from './schema';
import { ProductWithCategory } from './types';

const productTranslationConfig: TranslationConfig = {
  entityType: 'Product',
  translatableFields: ['name', 'description'],
};

function extractTranslatableFields(
  data: Prisma.ProductUpdateInput | ProductFormData,
): Record<string, string> {
  const result: Record<string, string> = {};

  if (typeof data.name === 'string') {
    result.name = data.name;
  }

  if (typeof data.description === 'string') {
    result.description = data.description;
  }

  return result;
}

export const productService = {
  async getAll(locale: Locale): Promise<ProductWithCategory[]> {
    const products = await productRepository.findMany();
    return Promise.all(
      products.map((product) =>
        translationService.getTranslatedEntity(
          product,
          locale,
          productTranslationConfig,
        ),
      ),
    );
  },

  async getById(
    id: string,
    locale: Locale,
  ): Promise<ProductWithCategory | null> {
    const product = await productRepository.findById(id);
    if (!product) return null;
    return translationService.getTranslatedEntity(
      product,
      locale,
      productTranslationConfig,
    );
  },

  async create(data: ProductFormData, locale: Locale): Promise<Product> {
    const { categoryId, ...restData } = data;

    const translatableData = extractTranslatableFields(restData);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      translatableData,
      locale,
      productTranslationConfig,
    );

    const productData: Prisma.ProductCreateInput = {
      name: defaultLocaleData.name,
      description: defaultLocaleData.description,
      price: restData.price,
      stock: restData.stock,
      imageBase64: restData.imageBase64,
      category: {
        connect: {
          id: categoryId,
        },
      },
    };

    const newProduct = await productRepository.create(productData);

    await translationService.createTranslations(
      newProduct.id,
      translatableData,
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
    data: Prisma.ProductUpdateInput,
    locale: Locale,
  ): Promise<Product> {
    const translatableData = extractTranslatableFields(data);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      translatableData,
      locale,
      productTranslationConfig,
    );

    const updateData: Prisma.ProductUpdateInput = { ...data };
    if (defaultLocaleData.name) updateData.name = defaultLocaleData.name;
    if (defaultLocaleData.description)
      updateData.description = defaultLocaleData.description;

    const updatedProduct = await productRepository.update(id, updateData);

    await translationService.updateTranslations(
      id,
      translatableData,
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
    const productToDelete = await productRepository.findById(id);
    if (!productToDelete) throw new Error('Product not found');

    const translatedProduct = await translationService.getTranslatedEntity(
      productToDelete,
      locale,
      productTranslationConfig,
    );

    await translationService.deleteTranslations(id, productTranslationConfig);

    await productRepository.delete(id);
    return translatedProduct;
  },
};
