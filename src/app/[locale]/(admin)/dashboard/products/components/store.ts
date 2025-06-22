import { create } from 'zustand';

import type { ProductFormData } from '@/features/product/schema';
import type { Product } from '@prisma/client';

interface ProductManagementStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingProduct: ProductFormData | null;
  deletingProduct: Product | null;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingProduct: (product: ProductFormData | null) => void;
  setDeletingProduct: (product: Product | null) => void;
  resetState: () => void;
}

export const useProductManagementStore = create<ProductManagementStore>()(
  (set) => ({
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
    editingProduct: null,
    deletingProduct: null,
    setAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
    setEditDialogOpen: (open) => set({ isEditDialogOpen: open }),
    setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
    setEditingProduct: (product) => set({ editingProduct: product }),
    setDeletingProduct: (product) => set({ deletingProduct: product }),
    resetState: () =>
      set({
        isAddDialogOpen: false,
        isEditDialogOpen: false,
        isDeleteDialogOpen: false,
        editingProduct: null,
        deletingProduct: null,
      }),
  }),
);
