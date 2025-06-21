import { Category, Prisma } from '@prisma/client';

import { Locale, routing } from '@/i18n/routing';
import { translate } from '@/lib/translation';

import { categoryRepository } from './repository';

async function getTranslatedCategory<T extends Category>(
  category: T,
  locale: Locale,
): Promise<T> {
  if (locale === routing.defaultLocale) return category;

  const translation = await categoryRepository.findTranslation(
    category.id,
    locale,
  );
  if (translation) {
    return {
      ...category,
      name: translation.name,
      description: translation.description,
    };
  }
  return category;
}

export const categoryService = {
  async getAll(locale: Locale): Promise<Category[]> {
    const categories = await categoryRepository.findMany();
    if (locale === routing.defaultLocale) return categories;
    return Promise.all(categories.map((c) => getTranslatedCategory(c, locale)));
  },

  async getById(id: string, locale: Locale): Promise<Category | null> {
    const category = await categoryRepository.findById(id);
    if (!category) return null;
    return getTranslatedCategory(category, locale);
  },

  async create(
    data: Prisma.CategoryCreateInput,
    locale: Locale,
  ): Promise<Category> {
    const defaultLocaleData = { ...data };
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

    const translationsToCreate: {
      locale: string;
      name: string;
      description: string;
    }[] = [];
    for (const targetLocale of routing.locales) {
      if (targetLocale === routing.defaultLocale) continue;
      if (targetLocale === locale) {
        translationsToCreate.push({
          locale: targetLocale,
          name: data.name,
          description: data.description!,
        });
      } else {
        translationsToCreate.push({
          locale: targetLocale,
          name: await translate(defaultLocaleData.name, targetLocale),
          description: await translate(
            defaultLocaleData.description!,
            targetLocale,
          ),
        });
      }
    }

    const newCategory = await categoryRepository.create(
      defaultLocaleData,
      translationsToCreate,
    );
    return getTranslatedCategory(newCategory, locale);
  },

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
    locale: Locale,
  ): Promise<Category> {
    const defaultLocaleData: Prisma.CategoryUpdateInput = { ...data };
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

    const baseCategory = await categoryRepository.findById(id);
    if (!baseCategory) throw new Error('Category not found');

    const updatedCategoryInDefault = {
      ...baseCategory,
      name: (defaultLocaleData.name as string) ?? baseCategory.name,
      description:
        (defaultLocaleData.description as string) ?? baseCategory.description,
    };

    const translationsToUpdate: {
      locale: string;
      name: string;
      description: string;
    }[] = [];
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
          name: await translate(updatedCategoryInDefault.name, targetLocale),
          description: await translate(
            updatedCategoryInDefault.description ?? '',
            targetLocale,
          ),
        });
      }
    }

    const updatedCategory = await categoryRepository.update(
      id,
      defaultLocaleData,
      translationsToUpdate,
    );
    return getTranslatedCategory(updatedCategory, locale);
  },

  async delete(id: string, locale: Locale): Promise<Category> {
    const categoryToDelete = await categoryRepository.findById(id);
    if (!categoryToDelete) throw new Error('Category not found');

    const translated = await getTranslatedCategory(categoryToDelete, locale);
    await categoryRepository.delete(id);
    return translated;
  },
};
