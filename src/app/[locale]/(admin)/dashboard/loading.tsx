import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { TableSkeleton } from './products/components/table-skeleton';

export default async function Loading() {
  const t = await getTranslations('dashboard');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('products')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('productTable.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
