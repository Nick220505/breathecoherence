import { PieChart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getOrderStatusData } from '../actions/dashboard-analytics';

export async function OrderStatusChart() {
  const t = await getTranslations('OrderStatusChart');
  const [statusData, statusDataErr] = await getOrderStatusData();

  if (statusDataErr) {
    throw new Error(t('error.loadOrderStatusData'));
  }

  const total = statusData.reduce((sum, item) => sum + item.count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PAID':
        return 'bg-green-500';
      case 'SHIPPED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
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
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-muted-foreground text-sm">{t('totalOrders')}</p>
          </div>

          <div className="space-y-3">
            {statusData.map((status) => {
              const percentage = total > 0 ? (status.count / total) * 100 : 0;

              return (
                <div key={status.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getStatusColor(status.status)}`}
                      />
                      <Badge variant={getStatusVariant(status.status)}>
                        {t(`status.${status.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {status.count}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(status.status)}`}
                      style={{ width: `${percentage}%` }}
                    />
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
