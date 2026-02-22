import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllOrders } from '@/features/order/actions';

import { OrderTable } from './components/order-table';

export default async function OrdersPage() {
  const t = await getTranslations('OrdersPage');
  const { data: orders, serverError } = await getAllOrders();

  if (serverError || !orders) {
    throw new Error(t('error.loadOrders'));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <OrderTable orders={orders} />
      </CardContent>
    </Card>
  );
}
