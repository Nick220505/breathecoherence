import type { Category, Product } from '@prisma/client';

export type ProductWithCategory = Product & {
  category: Category;
};

export type PartialProductWithCategory = Partial<Product> & {
  category?: { name: string };
};
