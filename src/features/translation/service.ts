import { Locale, routing } from '@/i18n/routing';
import { translate } from '@/lib/translation';

import { translationRepository } from './repository';
import { TranslatableFields, TranslationConfig } from './types';

export const translationService = {
  async getTranslatedEntity<T extends Record<string, unknown>>(
    entity: T,
    locale: Locale,
    config: TranslationConfig,
  ): Promise<T> {
    if (locale === routing.defaultLocale) {
      return entity;
    }

    const translations = await translationRepository.findMany(
      config.entityType,
      entity.id as string,
      locale,
    );

    if (translations.length === 0) {
      return entity;
    }

    const translatedEntity = { ...entity };

    for (const translation of translations) {
      if (config.translatableFields.includes(translation.field)) {
        (translatedEntity as Record<string, unknown>)[translation.field] =
          translation.value;
      }
    }

    return translatedEntity;
  },

  async createTranslations(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    config: TranslationConfig,
  ): Promise<void> {
    const translationsToCreate = await this.buildTranslations(
      entityId,
      data,
      sourceLocale,
      config,
    );

    if (translationsToCreate.length > 0) {
      await translationRepository.createMany(translationsToCreate);
    }
  },

  async buildTranslations(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    config: TranslationConfig,
  ) {
    const translationsToCreate = [];

    for (const targetLocale of routing.locales) {
      if (targetLocale === routing.defaultLocale) continue;

      const localeTranslations = await this.buildLocaleTranslations(
        entityId,
        data,
        sourceLocale,
        targetLocale,
        config,
      );
      translationsToCreate.push(...localeTranslations);
    }

    return translationsToCreate;
  },

  async buildLocaleTranslations(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    targetLocale: Locale,
    config: TranslationConfig,
  ) {
    const translations = [];

    for (const field of config.translatableFields) {
      const fieldValue = data[field];
      if (typeof fieldValue !== 'string') continue;

      const translatedValue = await this.getTranslatedValue(
        fieldValue,
        sourceLocale,
        targetLocale,
      );

      translations.push({
        entityType: config.entityType,
        entityId,
        locale: targetLocale,
        field,
        value: translatedValue,
      });
    }

    return translations;
  },

  async getTranslatedValue(
    fieldValue: string,
    sourceLocale: Locale,
    targetLocale: Locale,
  ): Promise<string> {
    if (targetLocale === sourceLocale) {
      return fieldValue;
    }

    const sourceValue =
      sourceLocale === routing.defaultLocale
        ? fieldValue
        : await translate(fieldValue, routing.defaultLocale);

    return translate(sourceValue, targetLocale);
  },

  async updateTranslations(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    config: TranslationConfig,
  ): Promise<void> {
    const updatedFields = Object.keys(data).filter((key) =>
      config.translatableFields.includes(key),
    );

    if (updatedFields.length === 0) return;

    await this.processLocaleUpdates(
      entityId,
      data,
      sourceLocale,
      config,
      updatedFields,
    );
  },

  async processLocaleUpdates(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    config: TranslationConfig,
    updatedFields: string[],
  ): Promise<void> {
    for (const targetLocale of routing.locales) {
      if (targetLocale === routing.defaultLocale) continue;

      await this.updateLocaleFields(
        entityId,
        data,
        sourceLocale,
        targetLocale,
        config,
        updatedFields,
      );
    }
  },

  async updateLocaleFields(
    entityId: string,
    data: TranslatableFields,
    sourceLocale: Locale,
    targetLocale: Locale,
    config: TranslationConfig,
    updatedFields: string[],
  ): Promise<void> {
    for (const field of updatedFields) {
      const fieldValue = data[field];
      if (typeof fieldValue !== 'string') continue;

      const translatedValue = await this.getTranslatedValue(
        fieldValue,
        sourceLocale,
        targetLocale,
      );

      await translationRepository.upsert(
        config.entityType,
        entityId,
        targetLocale,
        field,
        translatedValue,
      );
    }
  },

  async deleteTranslations(
    entityId: string,
    config: TranslationConfig,
  ): Promise<void> {
    await translationRepository.deleteMany(config.entityType, entityId);
  },

  async getDefaultLocaleData(
    data: TranslatableFields,
    sourceLocale: Locale,
    config: TranslationConfig,
  ): Promise<TranslatableFields> {
    if (sourceLocale === routing.defaultLocale) {
      return data;
    }

    const defaultLocaleData = { ...data };

    for (const field of config.translatableFields) {
      const fieldValue = data[field];
      if (typeof fieldValue === 'string') {
        defaultLocaleData[field] = await translate(
          fieldValue,
          routing.defaultLocale,
        );
      }
    }

    return defaultLocaleData;
  },
};
