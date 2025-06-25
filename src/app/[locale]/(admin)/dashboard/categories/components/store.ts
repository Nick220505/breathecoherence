import { create } from 'zustand';

import type { Category } from '@prisma/client';

interface CategoryStore {
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingCategory: Category | null;
  deletingCategory: Category | null;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingCategory: (category: Category | null) => void;
  setDeletingCategory: (category: Category | null) => void;
  resetState: () => void;
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  editingCategory: null,
  deletingCategory: null,
  setEditDialogOpen: (open) => set(() => ({ isEditDialogOpen: open })),
  setDeleteDialogOpen: (open) => set(() => ({ isDeleteDialogOpen: open })),
  setEditingCategory: (category) => set(() => ({ editingCategory: category })),
  setDeletingCategory: (category) =>
    set(() => ({ deletingCategory: category })),
  resetState: () =>
    set(() => ({
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      editingCategory: null,
      deletingCategory: null,
    })),
}));
