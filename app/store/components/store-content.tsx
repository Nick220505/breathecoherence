"use client";

import { useTranslation } from "@/components/language-provider";
import { type Product } from "@prisma/client";
import { CustomBlendCard } from "./product/custom-blend-card";
import { ProductCard } from "./product/product-card";

interface StoreContentProps {
  products: Product[];
  category: string;
}

export function StoreContent({ products, category }: StoreContentProps) {
  const { t } = useTranslation();

  if (!products.length && category !== "Flower Essence") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          {t("store.no_products")}
        </h2>
        <p className="text-gray-500 dark:text-gray-500">
          {t("store.try_adjusting")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {(!category || category === "Flower Essence") && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CustomBlendCard />
        </div>
      )}
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
}
