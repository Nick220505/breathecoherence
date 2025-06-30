import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllProducts } from '@/features/product/actions';

import { CreateProductDialog } from './components/create-product-dialog';
import { ProductTable } from './components/product-table';

export default async function ProductsPage() {
  const t = await getTranslations('ProductsPage');
  const [products, err] = await getAllProducts();

  if (err) {
    throw new Error(t('error.loadProducts'));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <CreateProductDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('add_product')}
            </Button>
          </CreateProductDialog>
        </div>
      </CardHeader>
      <CardContent>
        <ProductTable products={products} />
      </CardContent>
    </Card>
  );
}
