'use client';

import { useTranslations } from 'next-intl';

import type { ProductWithCategory } from '@/features/product/types';

import { CustomBlendCard } from './product/custom-blend-card';
import { ProductCard } from './product/product-card';
import { ProductSkeleton } from './product/product-skeleton';

interface StoreContentProps {
  products: ProductWithCategory[];
  category: string;
  isLoading: boolean;
}

export function StoreContent({
  products,
  category,
  isLoading,
}: Readonly<StoreContentProps>) {
  const t = useTranslations('StoreContent');
  const showCustomBlend = !category || category === 'Flower Essence';

  const getDelayClass = (index: number) => {
    if (index === 1) return 'delay-100';
    if (index === 2) return 'delay-200';
    if (index === 3) return 'delay-300';
    if (index === 4) return 'delay-400';
    if (index >= 5) return 'delay-500';
    return '';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {showCustomBlend && <ProductSkeleton />}
        {Array.from({ length: 5 }).map((_, i) => (
          <ProductSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (products.length === 0 && !showCustomBlend) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          {t('no_products')}
        </h2>
        <p className="text-gray-500 dark:text-gray-500">{t('try_adjusting')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {showCustomBlend && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CustomBlendCard />
        </div>
      )}
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${getDelayClass(
            index,
          )}`}
        >
          <ProductCard
            product={product}
            index={index}
            categoryName={product.category.name}
          />
        </div>
      ))}
    </div>
  );
}
