import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AddProductButton } from './components/add-product-button';
import { ProductTable } from './components/product-table';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your products and inventory',
};

export const revalidate = 3600;

export default async function AdminDashboard() {
  const t = await getTranslations('AdminDashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t('title')}</CardTitle>
          <AddProductButton />
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  );
}
