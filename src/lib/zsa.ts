import { getLocale } from 'next-intl/server';
import { createServerActionProcedure } from 'zsa';

import type { Locale } from '@/i18n/routing';

export const withLocaleProcedure = createServerActionProcedure().handler(
  async () => {
    const locale = (await getLocale()) as Locale;

    return {
      locale,
    };
  },
);
