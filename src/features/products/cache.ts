import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { productService } from "./service";

export const productCache = {
  getAll: unstable_cache(productService.getAll, ["products"], {
    revalidate: 3600,
    tags: ["products"],
  }),

  getById: unstable_cache(
    async (id: string) => {
      try {
        return await productService.getById(id);
      } catch (error) {
        if (error instanceof Error && error.message === "Product not found") {
          notFound();
        }
        throw error;
      }
    },
    ["product"],
    { revalidate: 3600, tags: ["products", "product"] }
  ),
};
