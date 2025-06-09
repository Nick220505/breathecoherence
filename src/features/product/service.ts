import { Prisma, Product } from '@prisma/client';

import { Locale, routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { translate } from '@/lib/translation';

export const productService = {
  async getAll(locale: Locale): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: { where: { locale } } },
    });

    if (locale === routing.defaultLocale) {
      return products;
    }

    return products.map((product) => {
      const translation = product.translations[0];
      if (translation) {
        return {
          ...product,
          name: translation.name,
          description: translation.description,
        };
      }
      return product;
    });
  },

  async getById(id: string, locale: Locale): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { translations: { where: { locale } } },
    });

    if (!product || locale === routing.defaultLocale) {
      return product;
    }

    const translation = product.translations[0];
    if (translation) {
      return {
        ...product,
        name: translation.name,
        description: translation.description,
      };
    }

    return product;
  },

  async getTranslatedProduct(
    product: Product,
    locale: Locale,
  ): Promise<Product> {
    if (locale === routing.defaultLocale) {
      return product;
    }

    const translation = await prisma.productTranslation.findUnique({
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

  create(data: Prisma.ProductCreateInput, locale: Locale): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const { name, description } = data;
      const defaultLocaleData = { ...data };

      if (locale !== routing.defaultLocale) {
        const nameInDefaultLocale = await translate(
          name,
          routing.defaultLocale,
        );
        const descriptionInDefaultLocale = await translate(
          description,
          routing.defaultLocale,
        );
        defaultLocaleData.name = nameInDefaultLocale;
        defaultLocaleData.description = descriptionInDefaultLocale;
      }

      const product = await tx.product.create({ data: defaultLocaleData });

      for (const targetLocale of routing.locales) {
        if (targetLocale === routing.defaultLocale) continue;

        let translatedName: string;
        let translatedDescription: string;

        if (targetLocale === locale) {
          translatedName = name;
          translatedDescription = description;
        } else {
          translatedName = await translate(product.name, targetLocale);
          translatedDescription = await translate(
            product.description,
            targetLocale,
          );
        }

        await tx.productTranslation.create({
          data: {
            productId: product.id,
            locale: targetLocale,
            name: translatedName,
            description: translatedDescription,
          },
        });
      }

      return product;
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

      const product = await tx.product.update({
        where: { id },
        data: defaultLocaleData,
      });

      for (const targetLocale of routing.locales) {
        if (targetLocale === routing.defaultLocale) continue;

        let translatedName: string;
        let translatedDescription: string;

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

        await tx.productTranslation.upsert({
          where: {
            productId_locale: { productId: product.id, locale: targetLocale },
          },
          update: {
            name: translatedName,
            description: translatedDescription,
          },
          create: {
            productId: product.id,
            locale: targetLocale,
            name: translatedName,
            description: translatedDescription,
          },
        });
      }

      return product;
    });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
