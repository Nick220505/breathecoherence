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

    return (
      <div className="bg-background rounded-lg border p-3 shadow-sm">
        <div className="flex flex-col space-y-1">
          <span className="font-medium">{data.name}</span>
          <span className="text-muted-foreground text-sm">
            {t('stock')}: {data.stock} {t('units')}
          </span>
          <span
            className={`text-xs font-medium ${
              data.stock === 0
                ? 'text-red-600'
                : data.stock <= 5
                  ? 'text-yellow-600'
                  : data.stock <= 20
                    ? 'text-blue-600'
                    : 'text-green-600'
            }`}
          >
            {data.stock === 0
              ? t('outOfStock')
              : data.stock <= 5
                ? t('lowStock')
                : data.stock <= 20
                  ? t('mediumStock')
                  : t('inStock')}
          </span>
        </div>
      </div>
    );
  }
  return null;
}
