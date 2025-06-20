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
    '/dashboard/products': {
      en: '/dashboard/products',
      es: '/dashboard/productos',
    },
    '/dashboard/categories': {
      en: '/dashboard/categories',
      es: '/dashboard/categorias',
    },
    '/dashboard/orders': {
      en: '/dashboard/orders',
      es: '/dashboard/ordenes',
    },
    '/dashboard/users': {
      en: '/dashboard/users',
      es: '/dashboard/usuarios',
    },
    '/account/orders': {
      en: '/account/orders',
      es: '/cuenta/pedidos',
    },
  },
});

export type Locale = (typeof routing)['locales'][number];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
