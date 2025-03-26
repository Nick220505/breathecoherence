import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

import { AdminDashboardLink } from './admin-dashboard-link';

export function NavigationItems() {
  const t = useTranslations('Navigation');
  const locale = useLocale();

  return (
    <div className="flex space-x-4">
      <div>
        <Link
          href={{
            pathname: '/store',
            query: {
              [locale === 'es' ? 'categoria' : 'category']: 'Sacred Geometry',
            },
          }}
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
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
        >
          <Button
            variant="ghost"
            className="hover:bg-primary/10 flex items-center gap-2 transition-colors duration-300"
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
