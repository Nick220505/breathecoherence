import { create } from 'zustand';

import type { ProductFormData } from '@/features/product/schema';
import type { Product } from '@prisma/client';

export interface SortConfig {
  key: keyof Product | 'category' | null;
  direction: 'asc' | 'desc';
}

interface ProductManagementStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingProduct: ProductFormData | null;
  productToDelete: Product | null;
  isDeleting: boolean;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingProduct: (product: ProductFormData | null) => void;
  setProductToDelete: (product: Product | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  resetDeleteState: () => void;

  currentPage: number;
  setCurrentPage: (page: number) => void;

  sortConfig: SortConfig;
  setSortConfig: (key: keyof Product | 'category') => void;
}

export const useProductManagementStore = create<ProductManagementStore>()(
  (set) => ({
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    editingProduct: null,
    productToDelete: null,
    isDeleting: false,
    setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
    setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
    setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setEditingProduct: (product) => set({ editingProduct: product }),
    setProductToDelete: (product) => set({ productToDelete: product }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),
    resetDeleteState: () =>
      set({
        isDeleteDialogOpen: false,
        productToDelete: null,
        isDeleting: false,
      }),

    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),

    sortConfig: {
      key: null,
      direction: 'asc',
    },
    setSortConfig: (key) =>
      set((state) => ({
        sortConfig: {
          key,
          direction:
            state.sortConfig.key === key && state.sortConfig.direction === 'asc'
              ? 'desc'
              : 'asc',
        },
      })),
  }),
);
