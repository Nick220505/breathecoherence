"use client";

import { ChatBot } from "@/components/chat-bot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { StoreHeader } from "./store-header";

export function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to load products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
      {filteredProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">No products found</p>
      ) : (
        <>
          {category === "Flower Essence" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/store/custom-blend">
                <Card className="card-hover-effect overflow-hidden cursor-pointer">
                  <CardHeader className="p-3 sm:p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                      <span className="text-xl sm:text-2xl float inline-block">
                        🌸
                      </span>
                      Create Your Own Bach Remedy Blend
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Flower Essence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <Image
                      src="/images/custom-blend.jpg"
                      alt="Create Your Own Bach Remedy Blend"
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <p className="text-muted-foreground text-sm">
                      Here, you can combine Bach flower essences that you
                      believe will benefit your health and emotional well-being.
                      Select between 2 to 5 essences (max. 7).
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center xs:text-left">
                      $19.99
                    </span>
                    <Button size="sm" className="pointer-events-none">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>

              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </>
      )}
      <ChatBot />
    </>
  );
}
