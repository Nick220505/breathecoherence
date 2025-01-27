"use client";

import { ChatBot } from "@/components/chat-bot";
import { useTranslation } from "@/components/language-provider";
import { translateProducts } from "@/lib/translation-service";
import { Product } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGrid } from "./product-grid";
import { StoreHeader } from "./store-header";

export function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, language } = useTranslation();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error(t("store.error.failed_load"));
        const data = await response.json();

        // Translate products if language is Spanish
        const processedProducts =
          language === "es" ? await translateProducts(data) : data;

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(t("store.error.failed_load"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [language, t]);

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(
        (product) => product.type.toLowerCase() === category.toLowerCase(),
      );
    }

    if (type) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(type.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [products, category, type]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">{t("store.error.failed_load")}</p>
      </div>
    );
  }

  return (
    <>
      <StoreHeader category={category} type={type} />
      <ProductGrid products={filteredProducts} isLoading={isLoading} />
      <ChatBot />
    </>
  );
}
