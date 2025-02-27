import { ProductFormData } from "@/lib/schemas/product";
import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "../db";

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!products) {
    throw new Error("Failed to fetch products");
  }

  return products;
}

export async function getProductById(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return product;
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  return prisma.product.create({ data });
}

export async function updateProduct(
  id: string,
  data: ProductFormData,
): Promise<Product> {
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.delete({ where: { id } });
}
