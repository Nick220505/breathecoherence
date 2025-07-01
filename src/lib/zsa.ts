import { getLocale } from 'next-intl/server';
import { createServerActionProcedure } from 'zsa';

import { auth } from '@/auth';
import type { Locale } from '@/i18n/routing';

export const withLocaleProcedure = createServerActionProcedure().handler(
  async () => {
    const locale = (await getLocale()) as Locale;

    return {
      locale,
    };
  },
);

export const withAuthProcedure = createServerActionProcedure().handler(
  async () => {
    const session = await auth();

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    return {
      user: session.user,
    };
  },
);
