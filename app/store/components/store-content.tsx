"use client";

import { getProducts } from "@/actions/product";
import { ChatBot } from "@/components/chat-bot";
import { type Product } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomBlendCard } from "./product/custom-blend-card";
import { ProductCard } from "./product/product-card";
import { ProductSkeleton } from "./product/product-skeleton";
import { StoreHeader } from "./store-header";

export function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (category && product.type !== category) return false;
    return true;
  });

  return (
    <>
      <StoreHeader category={category} type={type} />
      {!isLoading && filteredProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found</p>
      ) : (
        <>
          {!category || category === "Flower Essence" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomBlendCard />
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                : filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                : filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
            </div>
          )}
        </>
      )}
      <ChatBot />
    </>
  );
}
