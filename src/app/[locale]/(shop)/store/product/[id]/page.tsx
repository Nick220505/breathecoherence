import { productCache } from "@/features/products/cache";
import { ProductDetails } from "./components/ProductDetails";
import { ProductNotFound } from "./components/ProductNotFound";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await productCache.getById(id);

  if (!product) {
    return <ProductNotFound />;
  }

  return <ProductDetails product={product} />;
}
