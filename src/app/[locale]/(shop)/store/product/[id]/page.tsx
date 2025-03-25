import { notFound } from "next/navigation";
import { ProductDetails } from "./components/ProductDetails";
import { getProductById } from "@/features/products/controller";

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
