import { getLocale } from 'next-intl/server';

import { productService } from '@/features/product/service';

import { CustomBlendForm } from './components/custom-blend-form';

import type { Locale } from '@/i18n/routing';

export default async function CustomBlendPage() {
  const locale = (await getLocale()) as Locale;

  const flowerEssences = await productService.getByCategory(
    'Flower Essence',
    locale,
  );

  return <CustomBlendForm flowerEssences={flowerEssences} />;
}
