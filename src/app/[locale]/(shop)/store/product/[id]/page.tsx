import { notFound } from 'next/navigation';

import { getProductById } from '@/features/product/actions';

import { ProductDetails } from './components/product-details';

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
