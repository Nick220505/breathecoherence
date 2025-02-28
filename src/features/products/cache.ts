import { unstable_cache } from "next/cache";
import { productRepository } from "./repository";

export const productCache = {
  getAll: unstable_cache(productRepository.getAll, ["products"], {
    revalidate: 3600,
    tags: ["products"],
  }),

  getById: unstable_cache(productRepository.getById, ["product"], {
    revalidate: 3600,
    tags: ["products", "product"],
  }),
};
