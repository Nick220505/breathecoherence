import { Prisma, Product } from '@prisma/client';

import { routing, Locale } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { translate } from '@/lib/translation';

async function _upsertTranslations(
  tx: Prisma.TransactionClient,
  product: Product,
  data: Prisma.ProductCreateInput | Prisma.ProductUpdateInput,
  locale: Locale,
) {
  const { name, description } = data;

  for (const targetLocale of routing.locales) {
    if (targetLocale === routing.defaultLocale) continue;

    let translatedName: string | undefined;
    let translatedDescription: string | undefined;

    if (targetLocale === locale) {
      translatedName = name as string;
      translatedDescription = description as string;
    } else {
      translatedName = await translate(product.name, targetLocale);
      translatedDescription = await translate(
        product.description,
        targetLocale,
      );
    }

    if (translatedName && translatedDescription) {
      await tx.productTranslation.upsert({
        where: {
          productId_locale: { productId: product.id, locale: targetLocale },
        },
        update: { name: translatedName, description: translatedDescription },
        create: {
          productId: product.id,
          locale: targetLocale,
          name: translatedName,
          description: translatedDescription,
        },
      });
    }
  }
}

export const productService = {
  async getTranslatedProduct(
    product: Product,
    locale: Locale,
    tx?: Prisma.TransactionClient,
  ): Promise<Product> {
    const db = tx ?? prisma;
    if (locale === routing.defaultLocale) {
      return product;
    }

    const translation = await db.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId: product.id,
          locale,
        },
      },
    });

    if (translation) {
      return {
        ...product,
        name: translation.name,
        description: translation.description,
      };
    }

    return product;
  },

  async getAll(locale: Locale): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (locale === routing.defaultLocale) {
      return products;
    }

    return Promise.all(
      products.map((product) => this.getTranslatedProduct(product, locale)),
    );
  },

  async getById(id: string, locale: Locale): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return this.getTranslatedProduct(product, locale);
  },

  create(data: Prisma.ProductCreateInput, locale: Locale): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const { name, description } = data;
      const defaultLocaleData = { ...data };

      if (locale !== routing.defaultLocale) {
        defaultLocaleData.name = await translate(name, routing.defaultLocale);
        defaultLocaleData.description = await translate(
          description,
          routing.defaultLocale,
        );
      }

      const newProduct = await tx.product.create({ data: defaultLocaleData });

      await _upsertTranslations(tx, newProduct, data, locale);

      return this.getTranslatedProduct(newProduct, locale, tx);
    });
  },

  update(
    id: string,
    data: Prisma.ProductUpdateInput,
    locale: Locale,
  ): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const { name, description } = data;
      const defaultLocaleData = { ...data };

      if (locale !== routing.defaultLocale) {
        if (name) {
          defaultLocaleData.name = await translate(
            name as string,
            routing.defaultLocale,
          );
        }
        if (description) {
          defaultLocaleData.description = await translate(
            description as string,
            routing.defaultLocale,
          );
        }
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: defaultLocaleData,
      });

      await _upsertTranslations(tx, updatedProduct, data, locale);

      return this.getTranslatedProduct(updatedProduct, locale, tx);
    });
  },

  delete(id: string, locale: Locale): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) {
        throw new Error('Product not found');
      }

      const translatedProduct = await this.getTranslatedProduct(
        product,
        locale,
        tx,
      );

      await tx.product.delete({ where: { id } });

      return translatedProduct;
    });
  },
};
