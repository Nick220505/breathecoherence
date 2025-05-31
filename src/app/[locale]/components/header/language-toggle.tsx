'use client';

import { motion } from 'framer-motion';
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
import { usePathname, useRouter } from '@/i18n/routing';

type SupportedLanguage = 'en' | 'es';

const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    label: 'Switch to English',
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    label: 'Cambiar a Español',
  },
} as const satisfies Record<
  SupportedLanguage,
  {
    name: string;
    flag: string;
    label: string;
  }
>;

export function LanguageToggle() {
  const t = useTranslations('LanguageToggle');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as SupportedLanguage;
  const params = useParams();

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
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
      // Get the current URL's search params
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;

      // Handle category parameter translation
      const category =
        searchParams.get('category') ?? searchParams.get('categoria');
      const newSearchParams = new URLSearchParams();

      if (category) {
        // Use the appropriate parameter name based on language
        const categoryParam = newLanguage === 'en' ? 'category' : 'categoria';
        newSearchParams.set(categoryParam, category);
      }

      // Copy any other search parameters
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
          {(
            Object.entries(languages) as [
              SupportedLanguage,
              (typeof languages)[SupportedLanguage],
            ][]
          ).map(([code, { name, flag, label }]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLanguageChange(code)}
              className="hover:bg-accent/50 focus:bg-accent flex cursor-pointer items-center justify-between"
              aria-label={label}
              aria-current={currentLocale === code ? 'true' : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  {flag}
                </span>
                <span>{name}</span>
              </div>
              {currentLocale === code && (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
