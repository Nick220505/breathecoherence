import { notFound } from 'next/navigation';

import { getProductById } from '@/features/product/actions';

import { ProductDetails } from './components/product-details';

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const [product, err] = await getProductById({ id });

  if (err) {
    if (err.message.includes('Product not found by id')) {
      notFound();
    }
    throw err;
  }

  return <ProductDetails product={product} />;
}
