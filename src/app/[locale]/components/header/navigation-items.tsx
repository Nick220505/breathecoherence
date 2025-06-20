import { getLocale } from 'next-intl/server';

import { getAllCategories } from '@/features/category/actions';

import { AdminDashboardLink } from './admin-dashboard-link';
import { NavigationCategoryButton } from './navigation-category-button';

export async function NavigationItems() {
  const locale = (await getLocale()) ?? 'en';

  const categories = await getAllCategories();

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
      {categories.map((cat) => (
        <NavigationCategoryButton
          key={cat.id}
          categoryName={cat.name}
          locale={locale}
        />
      ))}

      <AdminDashboardLink />
    </div>
  );
}
