import { getLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/features/category/actions';
import { Link } from '@/i18n/routing';

import { AdminDashboardLink } from './admin-dashboard-link';

export async function NavigationItems() {
  const locale = (await getLocale()) ?? 'en';

  const categories = await getAllCategories();

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      {categories.map((cat) => (
        <div key={cat.id}>
          <Link
            href={{
              pathname: '/store',
              query: {
                [locale === 'es' ? 'categoria' : 'category']: cat.name,
              },
            }}
            className="w-full"
          >
            <Button
              variant="ghost"
              className="hover:bg-primary/10 flex w-full items-center justify-start gap-2 transition-colors duration-300 md:w-auto"
            >
              {cat.name}
            </Button>
          </Link>
        </div>
      ))}

      <AdminDashboardLink />
    </div>
  );
}
