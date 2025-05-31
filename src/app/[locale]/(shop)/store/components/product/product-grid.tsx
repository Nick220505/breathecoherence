'use client';

import { type Product } from '@prisma/client';

import { ProductCard } from './product-card';
import { ProductSkeleton } from './product-skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({
  products,
  isLoading,
}: Readonly<ProductGridProps>) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
      {isLoading
        ? [
            'skeleton-top-left',
            'skeleton-top-center',
            'skeleton-top-right',
            'skeleton-bottom-left',
            'skeleton-bottom-center',
            'skeleton-bottom-right',
          ].map((key) => <ProductSkeleton key={key} />)
        : products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
    </div>
  );
}
