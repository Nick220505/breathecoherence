import { notFound } from 'next/navigation';

import { getAllProducts, getProductById } from '@/features/product/actions';

import { ProductDetails } from './components/product-details';

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({ id: product.id }));
}

export const dynamicParams = true;

export default async function ProductPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const id = (await params).id;
  const product = await getProductById(id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
