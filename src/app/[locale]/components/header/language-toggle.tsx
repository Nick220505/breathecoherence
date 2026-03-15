'use client';

import { motion } from 'motion/react';
import { Check, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale, routing, usePathname, useRouter } from '@/i18n/routing';

export function LanguageToggle() {
  const t = useTranslations('LanguageToggle');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const params = useParams();

  const handleLanguageChange = (newLanguage: Locale) => {
    if (pathname === '/store/product/[id]') {
      const productId = params?.id as string;
      if (productId) {
        router.replace(
          { pathname: '/store/product/[id]', params: { id: productId } },
          { locale: newLanguage },
        );
      } else {
        router.replace({ pathname: '/' }, { locale: newLanguage });
      }
    } else {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;

      const category =
        searchParams.get('category') ?? searchParams.get('categoria');
      const newSearchParams = new URLSearchParams();

      if (category) {
        const categoryParam = newLanguage === 'en' ? 'category' : 'categoria';
        newSearchParams.set(categoryParam, category);
      }
      searchParams.forEach((value, key) => {
        if (key !== 'category' && key !== 'categoria') {
          newSearchParams.set(key, value);
        }
      });

      const newPathname = pathname;

      router.replace(
        {
          pathname: newPathname,
          query: Object.fromEntries(newSearchParams),
        },
        { locale: newLanguage },
      );
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t('toggle_language')}>
            <Globe className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {routing.locales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className="hover:bg-accent/50 focus:bg-accent flex cursor-pointer items-center justify-between"
              aria-label={t(`languages.${locale}.label`)}
              aria-current={currentLocale === locale ? 'true' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {t(`languages.${locale}.flag`)}
                </span>
                <span>{t(`languages.${locale}.name`)}</span>
              </div>
              {currentLocale === locale && (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
