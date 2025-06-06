import { Prisma, Product } from '@prisma/client';

import { Locale, routing } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { translationService } from '@/lib/translation-service';

export const productService = {
  async getAll(locale: Locale): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { locale },
        },
      },
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
      include: {
        translations: {
          where: { locale },
        },
      },
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

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data });

      for (const locale of routing.locales) {
        if (locale === routing.defaultLocale) continue;

        const translatedName = await translationService.translate(
          product.name,
          locale,
        );
        const translatedDescription = await translationService.translate(
          product.description,
          locale,
        );

        await tx.productTranslation.create({
          data: {
            productId: product.id,
            locale,
            name: translatedName,
            description: translatedDescription,
          },
        });
      }

      return product;
    });
  },

  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.update({ where: { id }, data });

      for (const locale of routing.locales) {
        if (locale === routing.defaultLocale) continue;

        const translatedName = await translationService.translate(
          product.name,
          locale,
        );
        const translatedDescription = await translationService.translate(
          product.description,
          locale,
        );

        await tx.productTranslation.upsert({
          where: { productId_locale: { productId: product.id, locale } },
          update: {
            name: translatedName,
            description: translatedDescription,
          },
          create: {
            productId: product.id,
            locale,
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
