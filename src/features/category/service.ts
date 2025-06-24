import { translationService } from '@/features/translation/service';

import { categoryRepository } from './repository';
import { CategoryFormData } from './schema';

import type { TranslationConfig } from '@/features/translation/types';
import type { Locale } from '@/i18n/routing';
import type { Category } from '@prisma/client';

const categoryTranslationConfig: TranslationConfig = {
  entityType: 'Category',
  translatableFields: ['name', 'description'],
};

export const categoryService = {
  async getAll(locale: Locale): Promise<Category[]> {
    const categories = await categoryRepository.findMany();

    return Promise.all(
      categories.map((category) =>
        translationService.getTranslatedEntity(
          category,
          locale,
          categoryTranslationConfig,
        ),
      ),
    );
  },

  async getById(id: string, locale: Locale): Promise<Category> {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error(`Category not found by id: ${id}`);
    }

    return translationService.getTranslatedEntity(
      category,
      locale,
      categoryTranslationConfig,
    );
  },

  async create(data: CategoryFormData, locale: Locale): Promise<Category> {
    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      categoryTranslationConfig,
    );

    const newCategory = await categoryRepository.create({
      name: defaultLocaleData.name,
      description: defaultLocaleData.description,
    });

    await translationService.createTranslations(
      newCategory.id,
      data,
      locale,
      categoryTranslationConfig,
    );

    return translationService.getTranslatedEntity(
      newCategory,
      locale,
      categoryTranslationConfig,
    );
  },

  async update(
    id: string,
    data: CategoryFormData,
    locale: Locale,
  ): Promise<Category> {
    await this.getById(id, locale);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      categoryTranslationConfig,
    );

    const updatedCategory = await categoryRepository.update(id, {
      ...data,
      ...defaultLocaleData,
    });

    await translationService.updateTranslations(
      id,
      data,
      locale,
      categoryTranslationConfig,
    );

    return translationService.getTranslatedEntity(
      updatedCategory,
      locale,
      categoryTranslationConfig,
    );
  },

  async delete(id: string, locale: Locale): Promise<Category> {
    const translatedCategory = await this.getById(id, locale);

    await translationService.deleteTranslations(id, categoryTranslationConfig);

    await categoryRepository.delete(id);

    return translatedCategory;
  },
};
