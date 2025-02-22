import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (!products) {
        throw new Error("Failed to fetch products");
      }

      return products;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch products",
      );
    }
  },
  ["products"],
  { revalidate: 3600, tags: ["products"] },
);

export const getProductById = unstable_cache(
  async (id: string): Promise<Product> => {
    try {
      const product = await prisma.product.findUnique({ where: { id } });

      if (!product) {
        notFound();
      }

      return product;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch product",
      );
    }
  },
  ["product"],
  { revalidate: 3600, tags: ["products", "product"] },
);
