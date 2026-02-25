import { createSafeActionClient } from 'next-safe-action';
import { Prisma } from '@/generated/prisma/client';
import { getLocale } from 'next-intl/server';

import { auth } from '@/auth';
import type { Locale } from '@/i18n/routing';
import {
  RECORD_NOT_FOUND,
  UNIQUE_CONSTRAINT_VIOLATION,
  FOREIGN_KEY_CONSTRAINT_VIOLATION,
  DATABASE_ERROR,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from './errors';

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          return RECORD_NOT_FOUND;
        case 'P2002':
          return UNIQUE_CONSTRAINT_VIOLATION;
        case 'P2003':
          return FOREIGN_KEY_CONSTRAINT_VIOLATION;
        default:
          return DATABASE_ERROR;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return INTERNAL_SERVER_ERROR;
  },
});

export const actionClientWithLocale = actionClient.use(async ({ next }) => {
  const locale = (await getLocale()) as Locale;

  return next({
    ctx: {
      locale,
    },
  });
});

export const actionClientWithAuth = actionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error(UNAUTHORIZED);
  }

  return next({
    ctx: {
      user: session.user,
    },
  });
});
