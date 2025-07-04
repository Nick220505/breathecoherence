import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { CategoriesCard } from './components/categories-card';
import { DashboardCardSkeleton } from './components/dashboard-card-skeleton';
import { OrderStatusChart } from './components/order-status-chart';
import { OrdersCard } from './components/orders-card';
import { ProductStockChart } from './components/product-stock-chart';
import { ProductsCard } from './components/products-card';
import { RecentActivityChart } from './components/recent-activity-chart';
import { SalesOverviewChart } from './components/sales-overview-chart';
import { UsersCard } from './components/users-card';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <SalesOverviewChart />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <OrderStatusChart />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <ProductStockChart />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <RecentActivityChart />
        </Suspense>
      </div>
    </div>
  );
}
