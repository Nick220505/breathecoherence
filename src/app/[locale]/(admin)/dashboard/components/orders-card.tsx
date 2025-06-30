import { ShoppingCart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getOrderCount } from '@/features/order/actions';

export async function OrdersCard() {
  const t = await getTranslations('dashboard');
  const [orderCount, orderCountErr] = await getOrderCount();

  if (orderCountErr) {
    throw new Error(t('error.loadOrderCount'));
  }

  return (
    <div className="bg-card flex items-center justify-center gap-6 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md max-[475px]:flex-col max-[475px]:gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
        <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{orderCount}</div>
        <div className="text-muted-foreground text-sm font-medium">
          {t('ordersLabel')}
        </div>
      </div>
    </div>
  );
}
