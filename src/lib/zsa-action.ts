import { createServerActionProcedure } from 'zsa';
import { getLocale } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';

export const actionProcedure = createServerActionProcedure();

// Create a procedure with locale context
export const actionProcedureWithLocale = actionProcedure.handler(async () => {
  const locale = (await getLocale()) as Locale;

  return {
    locale,
  };
});
