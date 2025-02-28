import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import { productRepository } from "./repository";
import { ProductFormData } from "./schema";

export const productService = {
  async getAll(): Promise<Product[]> {
    const products = await productRepository.getAll();

    if (!products) {
      throw new Error("Failed to fetch products");
    }

    return products;
  },

  async getById(id: string): Promise<Product> {
    const product = await productRepository.getById(id);

    if (!product) {
      notFound();
    }

    return product;
  },

  async create(data: ProductFormData): Promise<Product> {
    return productRepository.create(data);
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    const existingProduct = await productRepository.getById(id);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    return productRepository.update(id, data);
  },

  async delete(id: string): Promise<Product> {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return productRepository.delete(id);
  },
};
