import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllOrders } from '@/features/order/actions';

import { OrderTable } from './components/order-table';

export default async function OrdersPage() {
  const tDashboard = await getTranslations('dashboard');
  const orders = await getAllOrders();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{tDashboard('orderTable.title')}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <OrderTable orders={orders} />
      </CardContent>
    </Card>
  );
}
