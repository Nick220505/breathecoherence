'use client';

import { useTranslations } from 'next-intl';

import type { ProductStockData } from '@/features/dashboard/types';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProductStockData;
  }>;
}

export function ProductStockTooltip({ active, payload }: TooltipProps) {
  const t = useTranslations('ProductStockTooltip');

  if (active && payload?.length) {
    const data = payload[0].payload;

    const getStockStatus = (stock: number) => {
      if (stock === 0) return t('outOfStock');
      if (stock <= 5) return t('lowStock');
      if (stock <= 20) return t('mediumStock');
      return t('inStock');
    };

    const getStockStatusColor = (stock: number) => {
      if (stock === 0) return 'text-red-600';
      if (stock <= 5) return 'text-yellow-600';
      if (stock <= 20) return 'text-blue-600';
      return 'text-green-600';
    };

    return (
      <div className="bg-background rounded-lg border p-3 shadow-sm">
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{data.name}</span>
          <span className="text-muted-foreground text-sm">
            {t('stock')}: {data.stock} {t('units')}
          </span>
          <span
            className={`text-xs font-medium ${getStockStatusColor(data.stock)}`}
          >
            {getStockStatus(data.stock)}
          </span>
        </div>
      </div>
    );
  }
  return null;
}
