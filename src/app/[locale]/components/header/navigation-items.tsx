import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

import { AdminDashboardLink } from './admin-dashboard-link';

export function NavigationItems() {
  const t = useTranslations('Navigation');
  const locale = useLocale();

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      <div>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Sacred Geometry',
            },
          }}
          className="w-full"
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex w-full items-center justify-start gap-2 transition-colors duration-300 md:w-auto"
          >
            <span className="text-xl">⬡</span>
            {t('nav.sacred_geometry')}
          </Button>
        </Link>
      </div>

      <div>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Flower Essence',
            },
          }}
          className="w-full"
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex w-full items-center justify-start gap-2 transition-colors duration-300 md:w-auto"
          >
            <span className="text-xl">🌸</span>
            {t('nav.flower_essences')}
          </Button>
        </Link>
      </div>

      <AdminDashboardLink />
    </div>
  );
}
