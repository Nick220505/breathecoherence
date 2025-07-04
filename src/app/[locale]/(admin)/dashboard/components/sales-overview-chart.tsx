import { TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getSalesOverviewData } from '../actions/dashboard-analytics';

export async function SalesOverviewChart() {
  const t = await getTranslations('SalesOverviewChart');
  const [salesData, salesDataErr] = await getSalesOverviewData();

  if (salesDataErr) {
    throw new Error(t('error.loadSalesData'));
  }

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('title')}</CardTitle>
        <TrendingUp className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {t('totalRevenue')}
              </p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                {t('totalOrders')}
              </p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">{t('last7Days')}</p>
            <div className="space-y-2">
              {salesData.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-muted-foreground text-sm">
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">
                      {day.orders} {t('orders')}
                    </div>
                    <div className="text-sm font-bold">
                      ${day.revenue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
