import { Product } from "@prisma/client";
import { productRepository } from "./repository";
import { ProductFormData } from "./schema";

export const productService = {
  async getAll(): Promise<Product[]> {
    return productRepository.getAll();
  },

  async getById(id: string): Promise<Product> {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  async create(data: ProductFormData): Promise<Product> {
    return productRepository.create(data);
  },

  async update(id: string, data: ProductFormData): Promise<Product> {
    await this.getById(id);
    return productRepository.update(id, data);
  },

  async delete(id: string): Promise<Product> {
    await this.getById(id);
    return productRepository.delete(id);
  },
};
