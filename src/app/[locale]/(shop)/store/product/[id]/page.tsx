import { productCache } from "@/features/products/cache";
import { ProductDetails } from "./components/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await productCache.getById(id);
  return <ProductDetails product={product} />;
}
