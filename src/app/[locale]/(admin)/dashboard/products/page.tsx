import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { getAllProducts } from '@/features/product/actions';

import { AddProductButton } from './components/add-product-button';
import { AddProductDialog } from './components/add-product-dialog';
import { DeleteProductDialog } from './components/delete-product-dialog';
import { EditProductDialog } from './components/edit-product-dialog';
import { ProductTable } from './components/product-table';

export default async function ProductsPage() {
  const products = await getAllProducts();
  const t = await getTranslations('dashboard');

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
