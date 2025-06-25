import { create } from 'zustand';

import type { Category } from '@prisma/client';

interface CategoryStore {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  editingCategory: Category | null;
  deletingCategory: Category | null;
  setAddDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditingCategory: (category: Category | null) => void;
  setDeletingCategory: (category: Category | null) => void;
  resetState: () => void;
}

export const useCategoryStore = create<CategoryStore>()((set) => ({
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  editingCategory: null,
  deletingCategory: null,
  setAddDialogOpen: (open) => set(() => ({ isAddDialogOpen: open })),
  setEditDialogOpen: (open) => set(() => ({ isEditDialogOpen: open })),
  setDeleteDialogOpen: (open) => set(() => ({ isDeleteDialogOpen: open })),
  setEditingCategory: (category) => set(() => ({ editingCategory: category })),
  setDeletingCategory: (category) =>
    set(() => ({ deletingCategory: category })),
  resetState: () =>
    set(() => ({
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      editingCategory: null,
      deletingCategory: null,
    })),
}));
