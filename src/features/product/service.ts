import { Prisma, Product } from '@prisma/client';

import { routing, Locale } from '@/i18n/routing';
import { translate } from '@/lib/translation';

import { productRepository } from './repository';
import { ProductFormData } from './schema';
import { ProductWithCategory } from './types';

async function getTranslatedProduct<T extends Product>(
  product: T,
  locale: Locale,
): Promise<T> {
  if (locale === routing.defaultLocale) {
    return product;
  }

  const translation = await productRepository.findTranslation(
    product.id,
    locale,
  );

  if (translation) {
    return {
      ...product,
      name: translation.name,
      description: translation.description,
    };
  }

  return product;
}

export const productService = {
  async getAll(locale: Locale): Promise<ProductWithCategory[]> {
    const products = await productRepository.findMany();
    if (locale === routing.defaultLocale) {
      return products as ProductWithCategory[];
    }
    return Promise.all(
      products.map(
        (product) =>
          getTranslatedProduct(product, locale) as Promise<ProductWithCategory>,
      ),
    );
  },

  async getById(
    id: string,
    locale: Locale,
  ): Promise<ProductWithCategory | null> {
    const product = await productRepository.findById(id);
    if (!product) return null;
    return getTranslatedProduct(
      product,
      locale,
    ) as Promise<ProductWithCategory>;
  },

  async create(data: ProductFormData, locale: Locale): Promise<Product> {
    const { categoryId, ...restData } = data;
    const productData = {
      ...restData,
      category: {
        connect: {
          id: categoryId,
        },
      },
    };
    const defaultLocaleData = { ...productData };
    if (locale !== routing.defaultLocale) {
      if (typeof data.name === 'string') {
        defaultLocaleData.name = await translate(
          data.name,
          routing.defaultLocale,
        );
      }
      if (typeof data.description === 'string') {
        defaultLocaleData.description = await translate(
          data.description,
          routing.defaultLocale,
        );
      }
    }

    const translationsToCreate = [];
    for (const targetLocale of routing.locales) {
      if (targetLocale === routing.defaultLocale) continue;
      if (targetLocale === locale) {
        translationsToCreate.push({
          locale: targetLocale,
          name: data.name,
          description: data.description,
        });
      } else {
        translationsToCreate.push({
          locale: targetLocale,
          name: await translate(defaultLocaleData.name, targetLocale),
          description: await translate(
            defaultLocaleData.description,
            targetLocale,
          ),
        });
      }
    }

    const newProduct = await productRepository.create(
      defaultLocaleData,
      translationsToCreate,
    );
    return getTranslatedProduct(newProduct, locale);
  },

  async update(
    id: string,
    data: Prisma.ProductUpdateInput,
    locale: Locale,
  ): Promise<Product> {
    const defaultLocaleData: Prisma.ProductUpdateInput = { ...data };
    if (locale !== routing.defaultLocale) {
      if (typeof data.name === 'string') {
        defaultLocaleData.name = await translate(
          data.name,
          routing.defaultLocale,
        );
      }
      if (typeof data.description === 'string') {
        defaultLocaleData.description = await translate(
          data.description,
          routing.defaultLocale,
        );
      }
    }

    const baseProduct = await productRepository.findById(id);
    if (!baseProduct) throw new Error('Product not found');

    const updatedProductInDefaultLocale = {
      ...baseProduct,
      name:
        typeof defaultLocaleData.name === 'string'
          ? defaultLocaleData.name
          : baseProduct.name,
      description:
        typeof defaultLocaleData.description === 'string'
          ? defaultLocaleData.description
          : baseProduct.description,
    };

    const translationsToUpdate = [];
    for (const targetLocale of routing.locales) {
      if (targetLocale === routing.defaultLocale) continue;
      if (targetLocale === locale) {
        translationsToUpdate.push({
          locale: targetLocale,
          name: data.name as string,
          description: data.description as string,
        });
      } else {
        translationsToUpdate.push({
          locale: targetLocale,
          name: await translate(
            updatedProductInDefaultLocale.name,
            targetLocale,
          ),
          description: await translate(
            updatedProductInDefaultLocale.description,
            targetLocale,
          ),
        });
      }
    }

    const updatedProduct = await productRepository.update(
      id,
      defaultLocaleData,
      translationsToUpdate,
    );
    return getTranslatedProduct(updatedProduct, locale);
  },

  async delete(id: string, locale: Locale): Promise<Product> {
    const productToDelete = await productRepository.findById(id);
    if (!productToDelete) throw new Error('Product not found');

    const translatedProduct = await getTranslatedProduct(
      productToDelete,
      locale,
    );
    await productRepository.delete(id);
    return translatedProduct;
  },
};
