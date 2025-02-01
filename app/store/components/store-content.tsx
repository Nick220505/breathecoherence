"use client";

import { type Product } from "@prisma/client";
import { CustomBlendCard } from "./product/custom-blend-card";
import { ProductCard } from "./product/product-card";

interface StoreContentProps {
  products: Product[];
  category?: string;
  type?: string;
}

export function StoreContent({ products, category }: StoreContentProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No products found</p>
    );
  }

  return (
    <>
      {!category || category === "Flower Essence" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CustomBlendCard />
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </>
  );
}
