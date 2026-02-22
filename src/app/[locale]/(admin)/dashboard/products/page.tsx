import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllProducts } from '@/features/product/actions';

import { CreateProductButton } from './components/create-product-button';
import { ProductTable } from './components/product-table';

export default async function ProductsPage() {
  const t = await getTranslations('ProductsPage');
  const { data: products, serverError } = await getAllProducts();

  if (serverError || !products) {
    throw new Error(t('error.loadProducts'));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('title')}</CardTitle>
          <CreateProductButton />
        </div>
      </CardHeader>
      <CardContent>
        <ProductTable products={products} />
      </CardContent>
    </Card>
  );
}
