import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import prisma from '@/lib/prisma';

interface KpiCardProps {
  title: string;
  value: number | string;
}

function KpiCard({ title, value }: Readonly<KpiCardProps>) {
  return (
    <div className="bg-card flex flex-col gap-2 rounded-lg border p-6 shadow-sm">
      <span className="text-muted-foreground text-sm font-medium">{title}</span>
      <span className="text-3xl font-bold">{value}</span>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  const [productCount, categoryCount, orderCount, userCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title={t('productsLabel')} value={productCount} />
        <KpiCard title={t('categoriesLabel')} value={categoryCount} />
        <KpiCard title={t('ordersLabel')} value={orderCount} />
        <KpiCard title={t('usersLabel')} value={userCount} />
      </div>
    </div>
  );
}
