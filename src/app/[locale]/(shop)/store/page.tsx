import { productCache } from "@/features/products/cache";
import { Product } from "@prisma/client";
import { Suspense } from "react";
import { StoreContent } from "./components/store-content";
import { StoreHeader } from "./components/store-header";

export default async function Page(props: {
  searchParams?: Promise<{
    category?: string;
    categoria?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  // Handle both English and Spanish category parameters
  const category = searchParams?.category || searchParams?.categoria || "";
  const type = searchParams?.type || "";
  const products = await productCache.getAll();

  const filteredProducts = products.filter((product: Product) => {
    if (category && product.type !== category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background/80 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <StoreHeader category={category} type={type} />

          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-600 animate-spin" />
              </div>
            }
          >
            <StoreContent products={filteredProducts} category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
