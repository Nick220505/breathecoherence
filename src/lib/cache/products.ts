import { getProductById, getProducts } from "@/lib/db/products";
import { unstable_cache } from "next/cache";

export const getCachedProducts = unstable_cache(getProducts, ["products"], {
  revalidate: 3600,
  tags: ["products"],
});

export const getCachedProductById = unstable_cache(
  getProductById,
  ["product"],
  { revalidate: 3600, tags: ["products", "product"] },
);
