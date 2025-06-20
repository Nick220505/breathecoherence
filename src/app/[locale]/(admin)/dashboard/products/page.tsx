import { getAllProducts } from '@/features/product/actions';

import { ProductManagement } from '../components/product-management';

export default async function ProductsPage() {
  const products = await getAllProducts();

  return <ProductManagement products={products} />;
}
