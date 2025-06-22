export type TranslatableFields = Record<string, string>;

export interface TranslationConfig {
  entityType: string;
  translatableFields: string[];
}

export interface CreateTranslationData {
  entityType: string;
  entityId: string;
  locale: string;
  field: string;
  value: string;
}
