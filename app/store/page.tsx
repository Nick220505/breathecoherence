import { getProducts } from "@/actions/product";
import { ChatBot } from "@/components/chat-bot";
import { Suspense } from "react";
import { StoreContent } from "./components/store-content";
import { StoreHeader } from "./components/store-header";

export default async function Page(props: {
  searchParams?: Promise<{
    category?: string;
    type?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "";
  const type = searchParams?.type || "";
  const products = await getProducts();

  const filteredProducts = products.filter((product) => {
    if (category && product.type !== category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background">
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

      <ChatBot />
    </div>
  );
}
