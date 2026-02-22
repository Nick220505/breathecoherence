import { notFound } from 'next/navigation';

import { getProductById } from '@/features/product/actions';

import { ProductDetails } from './components/product-details';

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const { data: product, serverError } = await getProductById(id);

  if (serverError || !product) {
    if (serverError?.includes('Product not found by id')) {
      notFound();
    }
    throw new Error(serverError ?? 'Product not found');
  }

  return <ProductDetails product={product} />;
}
