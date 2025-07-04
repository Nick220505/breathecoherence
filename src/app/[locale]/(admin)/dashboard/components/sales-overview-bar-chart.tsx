'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslations } from 'next-intl';

import type { SalesOverviewData } from '@/features/dashboard/types';

interface SalesOverviewBarChartProps {
  data: SalesOverviewData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: {
      orders: number;
    };
  }>;
  label?: string;
}

interface CustomTooltipProps extends TooltipProps {
  revenueLabel: string;
  ordersLabel: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  revenueLabel,
  ordersLabel,
}: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background rounded-lg border p-2 shadow-sm">
        <div className="flex flex-col space-y-1">
          <span className="text-muted-foreground text-[0.70rem] uppercase">
            {label}
          </span>
          <span className="font-bold">
            {revenueLabel}: ${payload[0]?.value}
          </span>
          <span className="font-bold">
            {ordersLabel}: {payload[0]?.payload?.orders}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesOverviewBarChart({
  data,
}: Readonly<SalesOverviewBarChartProps>) {
  const t = useTranslations('SalesOverviewChart');
  const chartData = data
    .map((day) => ({
      date: new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      revenue: day.revenue,
      orders: day.orders,
    }))
    .reverse();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{t('last7Days')}</p>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={
                <CustomTooltip
                  revenueLabel={t('revenue')}
                  ordersLabel={t('orders')}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
