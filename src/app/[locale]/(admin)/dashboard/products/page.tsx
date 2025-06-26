import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ProductDialog } from './components/product-dialog';
import { ProductTable } from './components/product-table';
import { ProductTableSkeleton } from './components/product-table-skeleton';

export default async function ProductsPage() {
  const t = await getTranslations('ProductsPage');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <ProductDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_product')}
            </Button>
          </ProductDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}
