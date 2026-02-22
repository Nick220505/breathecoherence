import { PieChart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getOrderStatusData } from '../actions/dashboard-analytics';
import { OrderStatusPieChart } from './order-status-pie-chart';

export async function OrderStatusChart() {
  const t = await getTranslations('OrderStatusChart');
  const { data: statusData, serverError } = await getOrderStatusData();

  if (serverError || !statusData) {
    throw new Error(t('error.loadOrderStatusData'));
  }

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#eab308'; // yellow-500
      case 'PAID':
        return '#22c55e'; // green-500
      case 'SHIPPED':
        return '#3b82f6'; // blue-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary' as const;
      case 'PAID':
        return 'default' as const;
      case 'SHIPPED':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('title')}</CardTitle>
        <PieChart className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-muted-foreground text-sm">{t('totalOrders')}</p>
          </div>

          <OrderStatusPieChart data={statusData} />

          <div className="space-y-3">
            {statusData.map((status) => {
              const percentage = total > 0 ? (status.count / total) * 100 : 0;

              return (
                <div
                  key={status.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(status.status) }}
                    />
                    <Badge variant={getStatusVariant(status.status)}>
                      {t(`status.${status.status.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{status.count}</span>
                    <span className="text-muted-foreground text-sm">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
