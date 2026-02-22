import { Package } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getProductStockData } from '../actions/dashboard-analytics';
import { ProductStockBarChart } from './product-stock-bar-chart';

export async function ProductStockChart() {
  const t = await getTranslations('ProductStockChart');
  const { data: stockData, serverError } = await getProductStockData();

  if (serverError || !stockData) {
    throw new Error(t('error.loadStockData'));
  }

  const lowStockProducts = stockData.filter(
    (product) => product.stock <= 20 && product.stock > 0,
  );
  const outOfStockProducts = stockData.filter((product) => product.stock === 0);
  const inStockProducts = stockData.filter((product) => product.stock > 20);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('title')}</CardTitle>
        <Package className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">
                {t('inStock')}
              </p>
              <p className="text-2xl font-bold">{inStockProducts.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-yellow-600">
                {t('lowStock')}
              </p>
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">
                {t('outOfStock')}
              </p>
              <p className="text-2xl font-bold">{outOfStockProducts.length}</p>
            </div>
          </div>

          <ProductStockBarChart
            data={stockData}
            stockOverviewLabel={t('stockOverview')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
