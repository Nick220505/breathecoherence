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
    <main className="container mx-auto px-4 py-8">
      <StoreHeader category={category} type={type} />

      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
          </div>
        }
      >
        <StoreContent products={filteredProducts} category={category} />
      </Suspense>

      <ChatBot />
    </main>
  );
}
