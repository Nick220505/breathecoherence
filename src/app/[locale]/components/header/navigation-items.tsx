import { getLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { getAllCategories } from '@/features/category/actions';

import { AdminDashboardLink } from './admin-dashboard-link';
import { NavigationCategoryButton } from './navigation-category-button';

export async function NavigationItems() {
  const locale = (await getLocale()) ?? 'en';

  const categories = await getAllCategories();

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
