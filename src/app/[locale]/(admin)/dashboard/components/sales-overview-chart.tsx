import { TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getSalesOverviewData } from '@/features/dashboard/actions';
import { SalesOverviewBarChart } from './sales-overview-bar-chart';

export async function SalesOverviewChart() {
  const t = await getTranslations('SalesOverviewChart');
  const { data: salesData, serverError } = await getSalesOverviewData();

  if (serverError || !salesData) {
    throw new Error(t('error.loadSalesData'));
  }

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('title')}</CardTitle>
        <TrendingUp className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">
              {t('totalRevenue')}
            </p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            <p className="text-muted-foreground text-xs">{t('last7Days')}</p>
          </div>

          <SalesOverviewBarChart data={salesData} />
        </div>
      </CardContent>
    </Card>
  );
}
