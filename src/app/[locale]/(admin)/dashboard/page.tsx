import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { CategoriesCard } from './components/categories-card';
import { DashboardCardSkeleton } from './components/dashboard-card-skeleton';
import { OrdersCard } from './components/orders-card';
import { ProductsCard } from './components/products-card';
import { UsersCard } from './components/users-card';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

export default async function DashboardPage() {
  const t = await getTranslations('DashboardPage');

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Suspense fallback={<DashboardCardSkeleton />}>
          <ProductsCard />
        </Suspense>

        <Suspense fallback={<DashboardCardSkeleton />}>
          <CategoriesCard />
        </Suspense>

        <Suspense fallback={<DashboardCardSkeleton />}>
          <OrdersCard />
        </Suspense>

        <Suspense fallback={<DashboardCardSkeleton />}>
          <UsersCard />
        </Suspense>
      </div>
    </div>
  );
}
