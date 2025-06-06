import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es'] as const,
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/store': {
      en: '/store',
      es: '/tienda',
    },
    '/store/custom-blend': {
      en: '/store/custom-blend',
      es: '/tienda/mezcla-personalizada',
    },
    '/store/flower-essences': {
      en: '/store/flower-essences',
      es: '/tienda/esencias-florales',
    },
    '/store/product/[id]': {
      en: '/store/product/[id]',
      es: '/tienda/producto/[id]',
    },
    '/login': {
      en: '/login',
      es: '/iniciar-sesion',
    },
    '/register': {
      en: '/register',
      es: '/registrarse',
    },
    '/verify': {
      en: '/verify',
      es: '/verificar',
    },
    '/checkout': {
      en: '/checkout',
      es: '/pagar',
    },
    '/dashboard': '/dashboard',
  },
});

export type Locale = (typeof routing)['locales'][number];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
