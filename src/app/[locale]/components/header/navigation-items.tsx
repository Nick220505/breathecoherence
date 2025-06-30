import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { AlertCircle } from 'lucide-react';

import { getAllCategories } from '@/features/category/actions';

import { AdminDashboardLink } from './admin-dashboard-link';
import { NavigationCategoryButton } from './navigation-category-button';

export async function NavigationItems() {
  const locale = (await getLocale()) ?? 'en';
  const t = await getTranslations('Navigation');

  const [categories, err] = await getAllCategories();

  if (err) {
    return (
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1 text-sm text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          <AlertCircle className="h-4 w-4" />
          <span>{t('error.loadCategories')}</span>
        </div>
        <AdminDashboardLink />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      {categories.map((cat) => (
        <Suspense
          key={cat.id}
          fallback={
            <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
          }
        >
          <NavigationCategoryButton categoryName={cat.name} locale={locale} />
        </Suspense>
      ))}

      <AdminDashboardLink />
    </div>
  );
}
