import { categoryService } from '@/features/category/service';
import { translationService } from '@/features/translation/service';
import type { TranslationConfig } from '@/features/translation/types';
import type { Locale } from '@/i18n/routing';

import { PRODUCT_HAS_ORDERS } from './errors';
import { productRepository } from './repository';
import type {
  CreateProduct,
  Product,
  ProductWithCategory,
  UpdateProduct,
} from './schemas';

export const productService = {
  translationConfig: {
    entityType: 'Product',
    translatableFields: ['name', 'description'],
  } satisfies TranslationConfig,

  async getAll(locale: Locale): Promise<ProductWithCategory[]> {
    const products = await productRepository.findMany();

    return Promise.all(
      products.map(async (product) => {
        const translatedProduct = await translationService.getTranslatedEntity(
          product,
          locale,
          this.translationConfig,
        );

        const translatedCategory = await translationService.getTranslatedEntity(
          product.category,
          locale,
          categoryService.translationConfig,
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
          this.translationConfig,
        );

        const translatedCategory = await translationService.getTranslatedEntity(
          product.category,
          locale,
          categoryService.translationConfig,
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

    const translatedProduct = await translationService.getTranslatedEntity(
      product,
      locale,
      this.translationConfig,
    );

    const translatedCategory = await translationService.getTranslatedEntity(
      product.category,
      locale,
      categoryService.translationConfig,
    );

    return {
      ...translatedProduct,
      category: translatedCategory,
    };
  },

  getCount(): Promise<number> {
    return productRepository.count();
  },

  async create(data: CreateProduct, locale: Locale): Promise<Product> {
    const { categoryId, ...restData } = data;

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      restData,
      locale,
      this.translationConfig,
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
      this.translationConfig,
    );

    return translationService.getTranslatedEntity(
      newProduct,
      locale,
      this.translationConfig,
    );
  },

  async update(
    id: string,
    data: Omit<UpdateProduct, 'id'>,
    locale: Locale,
  ): Promise<Product> {
    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      this.translationConfig,
    );

    const updatedProduct = await productRepository.update(id, {
      ...data,
      ...defaultLocaleData,
    });

    await translationService.updateTranslations(
      id,
      data,
      locale,
      this.translationConfig,
    );

    return translationService.getTranslatedEntity(
      updatedProduct,
      locale,
      this.translationConfig,
    );
  },

  async delete(id: string, locale: Locale): Promise<Product> {
    const translatedProduct = await this.getById(id, locale);

    const hasOrders = await productRepository.hasOrders(id);

    if (hasOrders) {
      throw new Error(PRODUCT_HAS_ORDERS);
    }

    await translationService.deleteTranslations(id, this.translationConfig);

    await productRepository.delete(id);

    return translatedProduct;
  },
};
