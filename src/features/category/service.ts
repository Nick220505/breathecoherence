import { Category, Prisma } from '@prisma/client';

import { translationService } from '@/features/translation/service';
import { TranslationConfig } from '@/features/translation/types';
import { Locale } from '@/i18n/routing';

import { categoryRepository } from './repository';

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

  async create(
    data: Prisma.CategoryCreateInput,
    locale: Locale,
  ): Promise<Category> {
    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      categoryTranslationConfig,
    );

    const categoryData: Prisma.CategoryCreateInput = {
      name: defaultLocaleData.name,
      description: defaultLocaleData.description,
    };

    const newCategory = await categoryRepository.create(categoryData);

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
    data: Prisma.CategoryUpdateInput,
    locale: Locale,
  ): Promise<Category> {
    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      categoryTranslationConfig,
    );

    const updateData: Prisma.CategoryUpdateInput = { ...data };
    if (defaultLocaleData.name) updateData.name = defaultLocaleData.name;
    if (defaultLocaleData.description)
      updateData.description = defaultLocaleData.description;

    const updatedCategory = await categoryRepository.update(id, updateData);

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
    const categoryToDelete = await categoryRepository.findById(id);
    if (!categoryToDelete) {
      throw new Error(`Category not found by id: ${id}`);
    }

    const translatedCategory = await translationService.getTranslatedEntity(
      categoryToDelete,
      locale,
      categoryTranslationConfig,
    );

    await translationService.deleteTranslations(id, categoryTranslationConfig);

    await categoryRepository.delete(id);
    return translatedCategory;
  },
};
