import { AlertTriangle, Package } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getProductStockData } from '../actions/dashboard-analytics';

export async function ProductStockChart() {
  const t = await getTranslations('ProductStockChart');
  const [stockData, stockDataErr] = await getProductStockData();

  if (stockDataErr) {
    throw new Error(t('error.loadStockData'));
  }

  const lowStockProducts = stockData.filter(
    (product) => product.stock <= 5 && product.stock > 0,
  );
  const outOfStockProducts = stockData.filter((product) => product.stock === 0);
  const inStockProducts = stockData.filter((product) => product.stock > 5);

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          {t('outOfStock')}
        </Badge>
      );
    } else if (stock <= 5) {
      return (
        <Badge variant="secondary" className="text-xs">
          {t('lowStock')}
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="text-xs">
          {t('inStock')}
        </Badge>
      );
    }
  };

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

          {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm font-medium">{t('stockAlerts')}</p>
              </div>

              <div className="max-h-48 space-y-2 overflow-y-auto">
                {[...outOfStockProducts, ...lowStockProducts]
                  .slice(0, 10)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {t('stock')}: {product.stock}
                        </p>
                      </div>
                      <div className="ml-2">{getStockBadge(product.stock)}</div>
                    </div>
                  ))}
              </div>

              {outOfStockProducts.length + lowStockProducts.length > 10 && (
                <p className="text-muted-foreground text-center text-xs">
                  {t('andMore', {
                    count:
                      outOfStockProducts.length + lowStockProducts.length - 10,
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
