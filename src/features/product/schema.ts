import { ProductType } from '@prisma/client';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

export const getProductSchema = (
  t: Awaited<ReturnType<typeof getTranslations<'ProductSchema'>>>,
) =>
  z.object({
    id: z.string().optional(),
    name: z.string().min(3, t('nameMin')),
    description: z.string().min(10, t('descriptionMin')),
    type: z.nativeEnum(ProductType, {
      errorMap: () => ({ message: t('typeInvalid') }),
    }),
    price: z.coerce.number().min(0, t('priceMin')),
    stock: z.coerce.number().int(t('stockInt')).min(0, t('stockMin')),
    imageBase64: z
      .union([
        z.string().startsWith('data:image/', { message: t('imageInvalid') }),
        z.string().max(0),
        z.null(),
        z.undefined(),
      ])
      .optional(),
  });

export type ProductFormData = z.infer<ReturnType<typeof getProductSchema>>;
