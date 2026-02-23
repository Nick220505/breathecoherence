import { translationService } from '@/features/translation/service';
import type { TranslationConfig } from '@/features/translation/types';
import type { Locale } from '@/i18n/routing';

import { CATEGORY_HAS_PRODUCTS, CATEGORY_NOT_FOUND } from './errors';
import { categoryRepository } from './repository';
import type { Category, CreateCategory, UpdateCategory } from './schemas';

export const categoryService = {
  translationConfig: {
    entityType: 'Category',
    translatableFields: ['name', 'description'],
  } satisfies TranslationConfig,

  async getAll(locale: Locale): Promise<Category[]> {
    const categories = await categoryRepository.findMany();

    return Promise.all(
      categories.map((category) =>
        translationService.getTranslatedEntity(
          category,
          locale,
          this.translationConfig,
        ),
      ),
    );
  },

  async getById(id: string, locale: Locale): Promise<Category> {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error(CATEGORY_NOT_FOUND);
    }

    return translationService.getTranslatedEntity(
      category,
      locale,
      this.translationConfig,
    );
  },

  getCount(): Promise<number> {
    return categoryRepository.count();
  },

  async create(data: CreateCategory, locale: Locale): Promise<Category> {
    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      this.translationConfig,
    );

    const newCategory = await categoryRepository.create({
      name: defaultLocaleData.name,
      description: defaultLocaleData.description,
    });

    await translationService.createTranslations(
      newCategory.id,
      data,
      locale,
      this.translationConfig,
    );

    return translationService.getTranslatedEntity(
      newCategory,
      locale,
      this.translationConfig,
    );
  },

  async update(
    id: string,
    data: Omit<UpdateCategory, 'id'>,
    locale: Locale,
  ): Promise<Category> {
    await this.getById(id, locale);

    const defaultLocaleData = await translationService.getDefaultLocaleData(
      data,
      locale,
      this.translationConfig,
    );

    const updatedCategory = await categoryRepository.update(id, {
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
      updatedCategory,
      locale,
      this.translationConfig,
    );
  },

  async delete(id: string, locale: Locale): Promise<Category> {
    const translatedCategory = await this.getById(id, locale);

    const hasProducts = await categoryRepository.hasProducts(id);

    if (hasProducts) {
      throw new Error(CATEGORY_HAS_PRODUCTS);
    }

    await translationService.deleteTranslations(id, this.translationConfig);

    await categoryRepository.delete(id);

    return translatedCategory;
  },
};
