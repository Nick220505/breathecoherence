import { Suspense } from 'react';

import { getAllProducts } from '@/features/product/actions';

import { StoreContent } from './components/store-content';
import { StoreHeader } from './components/store-header';

interface PageProps {
  searchParams?: Promise<{
    category?: string;
    categoria?: string;
    type?: string;
  }>;
}

export default async function Page(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  const categoryQueryParam =
    searchParams?.category ?? searchParams?.categoria ?? '';
  const products = await getAllProducts();

  const getCategoryFromQuery = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    if (
      lowerQuery === 'sacred geometry' ||
      lowerQuery === 'geometría sagrada'
    ) {
      return 'Sacred Geometry';
    }
    if (lowerQuery === 'flower essence' || lowerQuery === 'esencia floral') {
      return 'Flower Essence';
    }
    return null;
  };

  const targetCategory = getCategoryFromQuery(categoryQueryParam);

  const filteredProducts = products.filter(
    (product) =>
      !targetCategory ||
      product.category.name.toLowerCase() === targetCategory.toLowerCase(),
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
              isLoading={false}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
