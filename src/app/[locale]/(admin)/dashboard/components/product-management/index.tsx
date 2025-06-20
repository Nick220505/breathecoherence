'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

import { AddProductButton } from './add-product-button';
import { AddProductDialog } from './add-product-dialog';
import { DeleteProductDialog } from './delete-product-dialog';
import { EditProductDialog } from './edit-product-dialog';
import { ProductTable } from './product-table';

import type { ProductWithCategory } from '@/features/product/types';

export function ProductManagement({
  products,
}: Readonly<{ products: ProductWithCategory[] }>) {
  const t = useTranslations('dashboard');

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('productTable.title')}</CardTitle>
            </div>
            <AddProductButton />
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
      <AddProductDialog />
      <EditProductDialog />
      <DeleteProductDialog />
    </Dialog>
  );
}
