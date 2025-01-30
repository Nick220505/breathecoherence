"use client";

import { type Product } from "@/lib/schemas/product";
import { ProductCard } from "./product-card";
import { ProductSkeleton } from "./product-skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
    </div>
  );
}
