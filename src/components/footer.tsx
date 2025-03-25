'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 border-t backdrop-blur-xs">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/BC-logo-transp-120.png"
                alt="Breathe Coherence"
                width={120}
                height={120}
                className="h-[60px] w-[60px] dark:invert"
                priority
              />
            </Link>
            <span className="text-muted-foreground text-sm">
              © {currentYear} Breathe Coherence. {t('rights')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href={{
                pathname: '/store',
                query: { category: 'Sacred Geometry' },
              }}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t('nav.sacred_geometry')}
            </Link>
            <Link
              href={{
                pathname: '/store',
                query: { category: 'Flower Essence' },
              }}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t('nav.flower_essences')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
