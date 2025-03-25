import { notFound } from 'next/navigation';

import { getProductById } from '@/features/products/controller';

import { ProductDetails } from './components/ProductDetails';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await getProductById(id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
