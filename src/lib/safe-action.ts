import { createSafeActionClient } from 'next-safe-action';
import { getLocale } from 'next-intl/server';

import { auth } from '@/auth';
import type { Locale } from '@/i18n/routing';

// Base action client with custom error handling
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    // Return error message as string (default behavior)
    if (error instanceof Error) {
      return error.message;
    }
    return 'Something went wrong';
  },
});

// Action client with locale context
export const actionClientWithLocale = actionClient.use(async ({ next }) => {
  const locale = (await getLocale()) as Locale;

  return next({
    ctx: {
      locale,
    },
  });
});

// Action client with authentication
export const actionClientWithAuth = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return next({
    ctx: {
      user: session.user,
    },
  });
});
