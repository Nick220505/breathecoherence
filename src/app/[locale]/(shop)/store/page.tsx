import { Product, ProductType } from '@prisma/client';
import { Suspense } from 'react';

import { getAllProducts } from '@/features/product/actions';

import { StoreContent } from './components/store-content';
import { StoreHeader } from './components/store-header';

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      category?: string;
      categoria?: string;
      type?: string;
    }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const categoryQueryParam =
    searchParams?.category ?? searchParams?.categoria ?? '';
  const products = await getAllProducts();

  const getProductTypeFromQuery = (query: string): ProductType | null => {
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery === 'sacred geometry' ||
      lowerQuery === 'geometría sagrada'
    ) {
      return ProductType.SACRED_GEOMETRY;
    }
    if (lowerQuery === 'flower essence' || lowerQuery === 'esencia floral') {
      return ProductType.FLOWER_ESSENCE;
    }
    return null;
  };

  const targetProductType = getProductTypeFromQuery(categoryQueryParam);

  const filteredProducts = products.filter(
    (product: Product) =>
      !targetProductType || product.type === targetProductType,
  );

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <StoreHeader
            category={categoryQueryParam}
            type={searchParams?.type ?? ''}
          />

          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-600" />
              </div>
            }
          >
            <StoreContent
              products={filteredProducts}
              category={categoryQueryParam}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
