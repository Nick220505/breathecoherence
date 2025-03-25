import { Product } from '@prisma/client';
import { Suspense } from 'react';
import { StoreContent } from './components/store-content';
import { StoreHeader } from './components/store-header';
import { getAllProducts } from '@/features/products/controller';

export default async function Page(props: {
  searchParams?: Promise<{
    category?: string;
    categoria?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  // Handle both English and Spanish category parameters
  const category = searchParams?.category || searchParams?.categoria || '';
  const type = searchParams?.type || '';
  const products = await getAllProducts();

  const filteredProducts = products.filter((product: Product) => {
    if (category && product.type !== category) return false;
    return true;
  });

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <StoreHeader category={category} type={type} />

          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-600" />
              </div>
            }
          >
            <StoreContent products={filteredProducts} category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
