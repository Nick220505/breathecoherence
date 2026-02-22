import type { Translation } from '@/generated/prisma/client';

import prisma from '@/lib/prisma';

export const translationRepository = {
  findMany(
    entityType: string,
    entityId: string,
    locale: string,
  ): Promise<Translation[]> {
    return prisma.translation.findMany({
      where: {
        entityType,
        entityId,
        locale,
      },
    });
  },

  findByField(
    entityType: string,
    entityId: string,
    locale: string,
    field: string,
  ): Promise<Translation | null> {
    return prisma.translation.findUnique({
      where: {
        entityType_entityId_locale_field: {
          entityType,
          entityId,
          locale,
          field,
        },
      },
    });
  },

  createMany(
    translations: Omit<Translation, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<{ count: number }> {
    return prisma.translation.createMany({
      data: translations,
    });
  },

  upsert(
    entityType: string,
    entityId: string,
    locale: string,
    field: string,
    value: string,
  ): Promise<Translation> {
    return prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType,
          entityId,
          locale,
          field,
        },
      },
      update: {
        value,
      },
      create: {
        entityType,
        entityId,
        locale,
        field,
        value,
      },
    });
  },

  deleteMany(entityType: string, entityId: string): Promise<{ count: number }> {
    return prisma.translation.deleteMany({
      where: {
        entityType,
        entityId,
      },
    });
  },
};
