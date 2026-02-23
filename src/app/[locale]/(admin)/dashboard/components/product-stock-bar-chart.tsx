'use client';

import { useTranslations } from 'next-intl';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ProductStockData } from '@/features/dashboard/types';

import { ProductStockTooltip } from './product-stock-tooltip';

interface ProductStockBarChartProps {
  data: ProductStockData[];
  stockOverviewLabel: string;
}

export function ProductStockBarChart({
  data,
  stockOverviewLabel,
}: Readonly<ProductStockBarChartProps>) {
  const t = useTranslations('ProductStockBarChart');
  const sortedData = [...data].sort((a, b) => a.stock - b.stock);
  const chartData = sortedData.slice(0, 8).map((product) => ({
    id: product.id,
    name:
      product.name.length > 15
        ? `${product.name.substring(0, 15)}...`
        : product.name,
    stock: product.stock,
  }));

  if (chartData.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">{stockOverviewLabel}</p>
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground text-sm">
            {t('noProductsFound')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{stockOverviewLabel}</p>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
          <BarChart data={chartData} layout="vertical">
            <XAxis
              type="number"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <Tooltip content={<ProductStockTooltip />} />
            <Bar
              dataKey="stock"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
