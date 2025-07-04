import { Package } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getProductCount } from '@/features/product/actions';

export async function ProductsCard() {
  const t = await getTranslations('ProductsCard');
  const [productCount, err] = await getProductCount();

  if (err) {
    throw new Error(t('error.loadProductCount'));
  }

  return (
    <div className="bg-card flex items-center justify-center gap-6 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md max-[475px]:flex-col max-[475px]:gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{productCount}</div>
        <div className="text-muted-foreground text-sm font-medium">
          {t('productsLabel')}
        </div>
      </div>
    </div>
  );
}
