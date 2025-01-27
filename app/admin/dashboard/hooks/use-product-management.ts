"use client";

import { useTranslation } from "@/components/language-provider";
import { Product, ProductFormData } from "@/types/product";
import { useCallback, useState } from "react";

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(
    async (data: ProductFormData) => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            type: data.type,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            imageUrl: data.imageUrl,
          }),
        });

        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.error || "Failed to create product");
        }

        await fetchProducts();
        return true;
      } catch (error) {
        console.error("Error adding product:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProducts],
  );

  const updateProduct = useCallback(
    async (id: string, data: ProductFormData) => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            type: data.type,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            imageUrl: data.imageUrl,
          }),
        });

        if (!response.ok) {
          throw new Error(t("admin.error.failed_update"));
        }

        await fetchProducts();
        return true;
      } catch (error) {
        console.error("Error updating product:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProducts, t],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(t("admin.error.failed_delete"));
        }

        setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        setError(t("admin.error.failed_delete"));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
