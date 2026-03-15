import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import type { ProductSummary } from '@/features/product/schemas';
import { Link } from '@/i18n/routing';

interface ProductRecommendationProps {
  product: ProductSummary;
}

export function ProductRecommendation({ product }: ProductRecommendationProps) {
  const t = useTranslations('ProductRecommendation');

  return (
    <div
      key={product.id}
      className="bg-background/50 hover:bg-background/80 flex items-center justify-between gap-3 rounded-lg border border-purple-500/20 p-3 transition-colors"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image
          src={
            product.imageBase64 ??
            (product.category?.name === 'Sacred Geometry'
              ? '/products/sacred-geometry.svg'
              : '/products/flower-essence.svg')
          }
          alt={product.name}
          width={50}
          height={50}
          className="flex-shrink-0 rounded-md"
        />
        <div className="flex-1">
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-muted-foreground text-xs">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
      <Link
        href={{ pathname: '/store/product/[id]', params: { id: product.id } }}
      >
        <Button
          size="sm"
          variant="outline"
          className="h-auto flex-shrink-0 border-purple-500/30 px-3 py-2 text-xs leading-tight hover:bg-purple-500/10"
        >
          <span className="text-center">
            {t('view_details').split(' ')[0]}
            <br />
            {t('view_details').split(' ')[1]}
          </span>
        </Button>
      </Link>
    </div>
  );
}
