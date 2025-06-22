import { Category, Prisma } from '@prisma/client';

import { translationService } from '@/features/translation/service';
import { TranslationConfig } from '@/features/translation/types';
import { Locale } from '@/i18n/routing';

import { categoryRepository } from './repository';

const categoryTranslationConfig: TranslationConfig = {
  entityType: 'Category',
  translatableFields: ['name', 'description'],
};

function extractTranslatableFields(
  data: Prisma.CategoryCreateInput | Prisma.CategoryUpdateInput,
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

  async getById(id: string, locale: Locale): Promise<Category | null> {
    const category = await categoryRepository.findById(id);
    if (!category) return null;
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
    const translatableData = extractTranslatableFields(data);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      translatableData,
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
      translatableData,
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
    const translatableData = extractTranslatableFields(data);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      translatableData,
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
      translatableData,
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
    if (!categoryToDelete) throw new Error('Category not found');

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
