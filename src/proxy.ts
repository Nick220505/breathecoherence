import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default function proxy(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware(routing);
  const response = handleI18nRouting(request);
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
