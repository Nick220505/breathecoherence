import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';

import { getAllCategories } from '@/features/category/actions';
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

export default async function StorePage(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  const categoryQueryParam =
    searchParams?.category ?? searchParams?.categoria ?? '';
  const [[products, productsErr], [categories, categoriesErr]] =
    await Promise.all([getAllProducts(), getAllCategories()]);

  if (categoriesErr || productsErr) {
    const t = await getTranslations('StorePage');
    if (categoriesErr) {
      throw new Error(t('error.loadCategories'));
    }
    if (productsErr) {
      throw new Error(t('error.loadProducts'));
    }
  }

  const targetCategory = categories.find(
    (c) => c.name.toLowerCase() === categoryQueryParam.toLowerCase(),
  );

  const filteredProducts = products.filter((product) =>
    targetCategory ? product.categoryId === targetCategory.id : true,
  );

  return (
    <div className="from-background via-background/80 to-background min-h-screen bg-linear-to-b">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <StoreHeader category={targetCategory} />

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
