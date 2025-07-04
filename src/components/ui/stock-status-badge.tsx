import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';

interface StockStatusBadgeProps {
  stock: number;
}

export function StockStatusBadge({ stock }: Readonly<StockStatusBadgeProps>) {
  const t = useTranslations('StockStatusBadge');

  let stockBadgeVariant = 'destructive';
  if (stock > 10) {
    stockBadgeVariant = 'default';
  } else if (stock > 0) {
    stockBadgeVariant = 'secondary';
  }

  const stockDisplay =
    stock > 0 ? t('in_stock_with_count', { count: stock }) : t('out_of_stock');

  return (
    <Badge
      variant={stockBadgeVariant as 'default' | 'secondary' | 'destructive'}
    >
      {stockDisplay}
    </Badge>
  );
}
