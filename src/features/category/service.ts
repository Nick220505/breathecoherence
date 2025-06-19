import { categoryRepository } from './repository';

import type { Category, Prisma } from '@prisma/client';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return categoryRepository.findMany();
  },

  async getById(id: string): Promise<Category | null> {
    return categoryRepository.findById(id);
  },

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return categoryRepository.create(data);
  },

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return categoryRepository.update(id, data);
  },

  async delete(id: string): Promise<Category> {
    const categoryToDelete = await categoryRepository.findById(id);
    if (!categoryToDelete) throw new Error('Category not found');

    await categoryRepository.delete(id);
    return categoryToDelete;
  },
};
