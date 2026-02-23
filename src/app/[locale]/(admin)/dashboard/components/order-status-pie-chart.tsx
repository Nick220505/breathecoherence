'use client';

import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTranslations } from 'next-intl';

import type { OrderStatusData } from '@/features/dashboard/types';

interface OrderStatusPieChartProps {
  data: OrderStatusData[];
}

const COLORS = {
  PENDING: '#eab308', // yellow-500
  PAID: '#22c55e', // green-500
  SHIPPED: '#3b82f6', // blue-500
  DELIVERED: '#8b5cf6', // violet-500
  CANCELLED: '#ef4444', // red-500
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      status: string;
      count: number;
      percentage: string;
      fill: string;
      translatedStatus: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background rounded-lg border p-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.fill }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{data.translatedStatus}</span>
            <span className="text-muted-foreground text-sm">
              {data.count} orders ({data.percentage}%)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function OrderStatusPieChart({
  data,
}: Readonly<OrderStatusPieChartProps>) {
  const t = useTranslations('OrderStatusChart');
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : '0',
    fill: COLORS[item.status as keyof typeof COLORS] || COLORS.PENDING,
    translatedStatus: t(`status.${item.status.toLowerCase()}`),
  }));

  // Find the status with the highest count for center display
  const dominantStatus =
    chartData.length > 0
      ? chartData.reduce((prev, current) =>
          current.count > prev.count ? current : prev,
        )
      : null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="count"
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.status}`} fill={entry.fill} />
          ))}
          {dominantStatus && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 10}
                        className="fill-foreground text-lg font-bold"
                      >
                        {dominantStatus.translatedStatus}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 15}
                        className="fill-muted-foreground text-sm"
                      >
                        {dominantStatus.count} orders (
                        {dominantStatus.percentage}%)
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          )}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
