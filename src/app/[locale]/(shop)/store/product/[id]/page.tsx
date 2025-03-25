import { ProductDetails } from "./components/ProductDetails";
import { getProductById } from "@/features/products/controller";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const product = await getProductById(id);
  return <ProductDetails product={product} />;
}
